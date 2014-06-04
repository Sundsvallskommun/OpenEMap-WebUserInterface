/**
 * Main map client class
 *  
 * Typical use case is to call the method configure(config) where config is a valid configuration object (usually parsed from JSON).
 */
Ext.define('OpenEMap.Client', {
    requires: ['GeoExt.data.MapfishPrintProvider',
               'OpenEMap.Gui',
               'OpenEMap.config.Parser',
               'OpenEMap.form.ZoomSelector',
               'OpenEMap.OpenLayers.Control.ModifyFeature',
               'OpenEMap.OpenLayers.Control.DynamicMeasure'],
    version: '1.0.4',
    /**
     * OpenLayers Map instance
     * 
     * @property {OpenLayers.Map}
     */
    map: null,
    /**
     * Overlay used by drawing actions
     * 
     * StyleMap can be overridden if more specific styling logic is required. 
     * 
     * Here is an example that changes style on scale:
     * 
     *     var style = new OpenLayers.Style();
     * 
     *     var ruleLow = new OpenLayers.Rule({
     *       symbolizer: {
     *         pointRadius: 10,
     *         fillColor: 'green',
     *         fillOpacity: 1
     *       },
     *       maxScaleDenominator: 10000
     *     });
     * 
     *     var ruleHigh = new OpenLayers.Rule({
     *       symbolizer: {
     *         pointRadius: 10,
     *         fillColor: 'red',
     *         fillOpacity: 1   
     *      },
     *      minScaleDenominator: 10000
     *     });
     * 
     *     style.addRules([ruleLow, ruleHigh]);
     * 
     *     var styleMap = new OpenLayers.StyleMap(style);
     *     mapClient.drawLayer.styleMap = styleMap;
     *     
     * Here is an example style to display labels for features with attribute property "type" == "label":
     * 
     *     var labels = new OpenLayers.Rule({
     *       filter: new OpenLayers.Filter.Comparison({
     *         type: OpenLayers.Filter.Comparison.EQUAL_TO,
     *         property: "type",
     *         value: "label",
     *       }),
     *       symbolizer: {
     *         label: "${label}"
     *       }
     *     });
     * 
     * See [OpenLayers documentation][1] on feature styling for more examples.
     * 
     * [1]: http://docs.openlayers.org/library/feature_styling.html
     * 
     * @property {OpenLayers.Layer.Vector}
     */
    drawLayer: null,
    /**
     * Clean up rendered elements
     */
    destroy: function() {
        if (this.map) {
            this.map.controls.forEach(function(control) { control.destroy(); });
            this.map.controls = null;
        }
        if (this.gui) this.gui.destroy();
    },
    /**
     * Configure map
     * 
     * If this method is to be used multiple times, make sure to call destroy before calling it.
     * 
     * @param {Object} config Map configuration object
     * @param {Object} options Additional MapClient options
     * @param {Object} options.gui Options to control GUI elements. Each property in this object is
     * essentially a config object used to initialize an Ext JS component. If a property is undefined or false
     * that component will not be initialized except for the map component. If a property is a defined
     * but empty object the component will be rendered floating over the map. To place a component into a 
     * predefined html tag, use the config property renderTo.
     * @param {Object} options.gui.map If undefined or false MapClient will create the map in a full page viewport
     * @param {Object} options.gui.layers Map layers tree list
     * @param {Object} options.gui.baseLayers Base layer switcher intended to be used as a floating control
     * @param {Object} options.gui.searchCoordinate Simple coordinate search and pan control
     * @param {Object} options.gui.objectConfig A generic form to configure feature attributes similar to a PropertyList
     * @param {Object} options.gui.zoomTools Zoom slider and buttons intended to be used as a floating control
     * @param {Object} options.gui.searchFastighet Search "fastighet" control
     * 
     * For more information about the possible config properties for Ext JS components see Ext.container.Container.
     */
    configure: function(config, options) {
        options = Ext.apply({}, options);
        
        this.initialConfig = Ext.clone(config);
        
        Ext.tip.QuickTipManager.init();
        
        
        var parser = Ext.create('OpenEMap.config.Parser');

        this.map = parser.parse(config);
        this.gui = Ext.create('OpenEMap.Gui', {
            config: config,
            gui: options.gui,
            map: this.map,
            orginalConfig: this.initialConfig
        });
        this.mapPanel = this.gui.mapPanel;
        this.drawLayer = this.gui.mapPanel.drawLayer;
    },
    /**
     * @param {String=} Name of layout to use (default is to use first layout as reported by server)
     * @return {String} JSON encoding of current map for MapFish Print module
     */
    encode: function(layout) {
        return JSON.stringify(this.mapPanel.encode(layout));
    },
    /**
     * Helper method to add GeoJSON directly to the draw layer
     * 
     * @param {string} geojson
     */
    addGeoJSON: function(geojson) {
        var format = new OpenLayers.Format.GeoJSON();
        var feature = format.read(geojson, "Feature");
        this.drawLayer.addFeatures([feature]);
    },
    /**
     * Allows you to override the sketch style at runtime
     * 
     * @param {OpenLayers.StyleMap} styleMap
     */
    setSketchStyleMap: function(styleMap) {
        this.map.controls.forEach(function(control) {
            if (control instanceof OpenLayers.Control.DrawFeature) {
                control.handler.layerOptions.styleMap = styleMap;
                if (control.handler.layer) {
                    control.handler.layer.styleMap = styleMap;
                }
            }
        });
    },
    /**
     * Enable additional labels for polygon edges
     * NOTE: deactivation not yet implemented
     * @param style hash of style properties that will override a default label style
     */
    toggleEdgeLabels: function(style) {
        var styleOverride = style || {};
        
        var drawLabels = function() {
            var createEdgeLabels = function(feature) {
                var geometry = feature.geometry;
                
                if (geometry.CLASS_NAME != "OpenLayers.Geometry.Polygon") return [];
                
                var linearRing = geometry.components[0];
                
                var edgeLabels = linearRing.components.slice(0, linearRing.components.length-1).map(function(point, i) {
                    var start = linearRing.components[i].clone();
                    var end = linearRing.components[i+1].clone();
                    var lineString = new OpenLayers.Geometry.LineString([start, end]);
                    var centroid = lineString.getCentroid({weighted: true});
                    var style = Ext.applyIf(Ext.clone(styleOverride), {
                        label: lineString.getLength().toFixed(2).toString() + " m",
                        strokeColor: "#000000",
                        strokeWidth: 3,
                        labelAlign: 'cm'
                    });
                    var feature = new OpenLayers.Feature.Vector(centroid, null, style);
                    return feature;
                });
                
                return edgeLabels;
            }
            
            this.labelLayer.destroyFeatures();
            
            var edgeLabelsArrays = this.drawLayer.features.map(createEdgeLabels);
            if (edgeLabelsArrays.length > 0) {
                var edgeLabels = edgeLabelsArrays.reduce(function(a, b) {
                    return a.concat(b);
                });
                this.labelLayer.addFeatures(edgeLabels);
            }
        };
        
        if (this.labelLayer == null) {
            this.labelLayer = new OpenLayers.Layer.Vector();
            this.map.addLayer(this.labelLayer);
            
            this.drawLayer.events.on({
                "featuremodified": drawLabels,
                "vertexmodified": drawLabels,
                "featuresadded": drawLabels,
                "featuresremoved": drawLabels,
                scope: this 
            });
        } else {
            // TODO: disable edge labels
        }
        
        drawLabels.apply(this);
    }
});
