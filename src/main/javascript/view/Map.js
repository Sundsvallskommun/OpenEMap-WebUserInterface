/**
 * 
 */
Ext.define('OpenEMap.view.Map' ,{
    extend: 'GeoExt.panel.Map',
    border: false,
    anchor: '100% 100%',
    constructor: function(config) {
        this.initDefaultLayers(config.config);
        
        var printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
            url: "/print/pdf",
            autoLoad: true,
            timeout: 60*1000,
            listeners: {
                /*"loadcapabilities": function(printProvider, capabilities) {
                    // NOTE: need to override to test locally...
                    capabilities.createURL = "/print/pdf/create.json";
                },*/
                "encodelayer": function(printProvider, layer, encodedLayer) {
                    if (encodedLayer && encodedLayer.baseURL) {
                        encodedLayer.baseURL = encodedLayer.baseURL.replace('gwc/service/', '');
                    }
                }/*,
                "beforedownload": function(printProvider, url) {
                    console.log("beforedownload");
                }*/
            }
        });
        
        var printExtent = Ext.create('GeoExt.plugins.PrintExtent', {
            printProvider: printProvider
        });
        
        this.encode = function(options) {
            var page = printExtent.addPage();
            var json = printProvider.encode(printExtent.map, printExtent.pages, options);
            printExtent.removePage(page);
            return json;
        }
        
        printProvider.encode = function(map, pages, options) {
            if(map instanceof GeoExt.MapPanel) {
                map = map.map;
            }
            pages = pages instanceof Array ? pages : [pages];
            options = options || {};
            if(this.fireEvent("beforeprint", this, map, pages, options) === false) {
                return;
            }

            var jsonData = Ext.apply({
                units: map.getUnits(),
                srs: map.baseLayer.projection.getCode(),
                layout: this.layout.get("name"),
                dpi: this.dpi.get("value")
            }, this.customParams);

            var pagesLayer = pages[0].feature.layer;
            var encodedLayers = [];

            // ensure that the baseLayer is the first one in the encoded list
            var layers = map.layers.concat();

            Ext.Array.remove(layers, map.baseLayer);
            Ext.Array.insert(layers, 0, [map.baseLayer]);

            Ext.each(layers, function(layer){
                if(layer !== pagesLayer && layer.getVisibility() === true) {
                    var enc = this.encodeLayer(layer);
                    enc && encodedLayers.push(enc);
                }
            }, this);
            jsonData.layers = encodedLayers;

            var encodedPages = [];
            Ext.each(pages, function(page) {

                encodedPages.push(Ext.apply({
                    center: [page.center.lon, page.center.lat],
                    scale: page.scale.get("value"),
                    rotation: page.rotation
                }, page.customParams));
            }, this);
            jsonData.pages = encodedPages;

            if (options.overview) {
                var encodedOverviewLayers = [];
                Ext.each(options.overview.layers, function(layer) {
                    var enc = this.encodeLayer(layer);
                    enc && encodedOverviewLayers.push(enc);
                }, this);
                jsonData.overviewLayers = encodedOverviewLayers;
            }

            if(options.legend && !(this.fireEvent("beforeencodelegend", this, jsonData, options.legend) === false)) {
                var legend = options.legend;
                var rendered = legend.rendered;
                if (!rendered) {
                    legend = legend.cloneConfig({
                        renderTo: document.body,
                        hidden: true
                    });
                }
                var encodedLegends = [];
                legend.items && legend.items.each(function(cmp) {
                    if(!cmp.hidden) {
                        var encFn = this.encoders.legends[cmp.getXType()];
                        // MapFish Print doesn't currently support per-page
                        // legends, so we use the scale of the first page.
                        encodedLegends = encodedLegends.concat(
                            encFn.call(this, cmp, jsonData.pages[0].scale));
                    }
                }, this);
                if (!rendered) {
                    legend.destroy();
                }
                jsonData.legends = encodedLegends;
            }
            
            return jsonData;
        }
        
        config.plugins = [printExtent];
        
        this.callParent(arguments);
                
        this.layers.add(this.searchLayer);
        this.layers.add(this.drawLayer);
        this.layers.add(this.measureLayer);
        this.layers.add(this.measureLayerSegmentsLayer);
        
        this.selectControl = new OpenLayers.Control.SelectFeature(this.drawLayer);
        this.map.addControl(this.selectControl);
    },
    unselectAll: function() {
        this.drawLayer.selectedFeatures.forEach(function(feature) {
            this.selectControl.unselect(feature);
        }, this);
    },
    parseStyle: function(style) {
        var template = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "#e8ffee",
                    fillOpacity: 0.9,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#29bf4c"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeColor: "#29bf4c",
                    strokeOpacity: 1
                },
                "Polygon": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#29bf4c",
                    fillColor: "#e8ffee",
                    fillOpacity: 0.9
                }
            };
        
        var createSymbolizer = function(style) {
            var clone = Ext.clone(template);
            if (style["Point"]) {
                Ext.apply(clone["Point"], style["Point"]);
                Ext.apply(clone["Line"], style["Line"]);
                Ext.apply(clone["Polygon"], style["Polygon"]);
                if (style.labelSegments){
                    Ext.apply(clone["labelSegments"], style["labelSegments"]);
                }
                if (style.labelLength){
                    Ext.apply(clone["labelLength"], style["labelLength"]);
                }
            } else {
                Ext.apply(clone["Point"], style);
                Ext.apply(clone["Line"], style);
                Ext.apply(clone["Polygon"], style);
            }
            return clone;
        };
        
        var defaultStyle = new OpenLayers.Style(null, {rules: [ new OpenLayers.Rule({symbolizer: template})]});
        var selectStyle;
        var temporaryStyle;
        var measureStyle;
        if (style) {
            if (style["default"]) {
                defaultStyle = createSymbolizer(style["default"]);
                defaultStyle = new OpenLayers.Style(null, {rules: [ new OpenLayers.Rule({symbolizer: defaultStyle})]});
            }
            if (style["select"]) {
                selectStyle = createSymbolizer(style["select"]);
                selectStyle = new OpenLayers.Style(null, {rules: [ new OpenLayers.Rule({symbolizer: selectStyle})]});
            }
            if (style["temporary"]) {
                temporaryStyle = createSymbolizer(style["temporary"]);
                temporaryStyle = new OpenLayers.Style(null, {rules: [ new OpenLayers.Rule({symbolizer: temporaryStyle})]});
            }
            if (style["labelLength"]){
                measureStyle = createSymbolizer(style);
                measureStyle = new OpenLayers.Style(null, {rules: [new OpenLayers.Rule({symbolizer: measureStyle}) ] });

            }
            if (!style["default"]) {
                defaultStyle = createSymbolizer(style);
                defaultStyle = new OpenLayers.Style(null, {rules: [ new OpenLayers.Rule({symbolizer: defaultStyle})]});
            }
        }
        
        var map = {
            "default": defaultStyle
        };
        if (selectStyle) {
            map["select"] = selectStyle;
        }
        if (temporaryStyle) {
            map["temporary"] = temporaryStyle;
        }

        if (measureStyle){
            map["default"] = measureStyle;
        }

        var styleMap = new OpenLayers.StyleMap(map);
        
        return styleMap;
    },
    initDefaultLayers: function(config) {
        if (!config.drawStyle) {
            config.drawStyle = {
                    "default": {
                        "Point": {
                            pointRadius: 4,
                            graphicName: "square",
                            fillColor: "#ffffff",
                            fillOpacity: 1,
                            strokeWidth: 1,
                            strokeOpacity: 1,
                            strokeColor: "#2969bf"
                        },
                        "Line": {
                            strokeWidth: 3,
                            strokeColor: "#2969bf",
                            strokeOpacity: 1
                        },
                        "Polygon": {
                            strokeWidth: 3,
                            strokeOpacity: 1,
                            strokeColor: "#2969bf",
                            fillOpacity: 0
                        }
                    },
                    "select": {
                        strokeWidth: 3,
                        strokeOpacity: 1,
                        fillColor: "#deecff",
                        fillOpacity: 0.9,
                        strokeColor: "#2969bf"
                    },
                    "temporary": {
                        strokeWidth: 3,
                        strokeOpacity: 0.75,
                        fillColor: "#ff00ff",
                        fillOpacity: 0,
                        strokeColor: "#ff00ff"
                    }
            };
        }
        
        this.drawLayer = new OpenLayers.Layer.Vector('Drawings', {
            displayInLayerSwitcher: false,
            styleMap: this.parseStyle(config.drawStyle)
        });
        
        if (config.autoClearDrawLayer) {
            this.drawLayer.events.register('beforefeatureadded', this, function() {
                this.drawLayer.destroyFeatures();
            });
        }
        
        function onFeatureadded(e) {
            var feature = e.feature;
            this.selectControl.select(feature);
        }
        
        function onBeforefeaturemodified(e) {
            var feature = e.feature;
            this.selectControl.select(feature);
        }
        
        function onAfterfeaturemodified(e) {
            var feature = e.feature;
            //this.selectControl.unselect(feature);
        }
        
        //this.drawLayer.events.register('featureadded', this, onFeatureadded);
        this.drawLayer.events.register('beforefeaturemodified', this, onBeforefeaturemodified);
        this.drawLayer.events.register('afterfeaturemodified', this, onAfterfeaturemodified);
        
        var searchStyle = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "#ffffff",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#2969bf"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeColor: "#2969bf",
                    strokeOpacity: 1
                },
                "Polygon": {
                    strokeDashstyle: 'dot',
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#f58d1e",
                    fillOpacity: 0
                }
        };
        
        this.searchLayer = new OpenLayers.Layer.Vector('Searchresult', {
            displayInLayerSwitcher: false,
            styleMap: this.parseStyle(searchStyle)
        });

        var measureStyle = {
            "Point": {
                //pointRadius: 4,
                //graphicName: 'square',
                //fillColor: 'white',
                //fillOpacity: 1,
                //strokeWidth: 1,
                //strokeOpacity: 1,
                //strokeColor: '#333333', 
                label: '${measure} ${units}',
                fontSize: '12px',
                fontColor: '#800517',
                fontFamily: 'Verdana',
                labelOutlineColor: '#eeeeee',
                labelAlign: 'cm',
                labelOutlineWidth: 2
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: '#666666',
                strokeDashstyle: 'solid'
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeDashstyle: 'solid',
                fillColor: 'white',
                fillOpacity: 0.3
            },
            labelSegments: {
                label: '${measure} ${units}',
                fontSize: '12px',
                fontColor: '#800517',
                fontFamily: 'Verdana',
                labelOutlineColor: '#eeeeee',
                labelAlign: 'cm',
                labelOutlineWidth: 2
            },    
            labelLength: {
                label: '${measure} ${units}\n',
                fontSize: '12px',
                fontWeight: 'bold',
                fontColor: '#800517',
                fontFamily: 'Verdana',
                labelOutlineColor: '#eeeeee',
                labelAlign: 'lb',
                labelOutlineWidth: 3
            }
        };

        
        this.measureLayer = new OpenLayers.Layer.Vector('MeasureLayer',{
        	displayInLayerSwitcher : false,
            styleMap : this.parseStyle(measureStyle)
        });

        this.measureLayerSegmentsLayer = new OpenLayers.Layer.Vector('MeasureLayerSegmentsLayer',{
            displayInLayerSwitcher : false,
            styleMap : this.parseStyle(measureStyle)
        });
    }
});
