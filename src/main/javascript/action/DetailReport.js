Ext.define('OpenEMap.action.DetailReport', {
    extend: 'OpenEMap.action.Action',
    requires: ['OpenEMap.view.DetailReportResults'],
    
    constructor: function(config) {
        
        var mapPanel = config.mapPanel;
        var layer = mapPanel.searchLayer;
        var map = config.map;
        
        var Click = OpenLayers.Class(OpenLayers.Control, {
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
                this.handler = new OpenLayers.Handler.Click(
                    this, {
                        'click': this.onClick
                    }, this.handlerOptions
                );
            },
            onClick: function(evt) {
                mapPanel.setLoading(true);
                layer.destroyFeatures();
                
                var lonlat = map.getLonLatFromPixel(evt.xy);
                
                var x = lonlat.lon;
                var y = lonlat.lat;
                
                var point = new OpenLayers.Geometry.Point(x, y);
                var feature = new OpenLayers.Feature.Vector(point);
                layer.addFeatures([feature]);
                
                OpenEMap.requestLM({
                    url: 'enhetsomraden?x=' + x + '&y=' + y,
                    success: function(response) {
                        var features = new OpenLayers.Format.GeoJSON().read(response.responseText);
                        layer.addFeatures(features);
                        var extent = layer.getDataExtent();
                        map.zoomToExtent(extent);
                        
                        var geometry = features[0].geometry;
                        var fbet = features[0].attributes.name;
                        
                        var options = Ext.apply({
                            url: "wfs",
                            version: "1.1.0",
                            srsName: "EPSG:3006",
                            featureType: "DetaljplanGallande_yta",
                            featurePrefix: "RIGES"
                        });
                        
                        var protocol = new OpenLayers.Protocol.WFS(options);
                        
                        protocol.read({
                            filter: new OpenLayers.Filter({
                                type: OpenLayers.Filter.Spatial.INTERSECTS,
                                value: geometry
                            }),
                            callback: function(response) {
                                var features = response.features;
                                if (features && features.length>0) {
                                	
                                    layer.addFeatures(features);
                                    
                                    var detailReportResults = Ext.create('OpenEMap.view.DetailReportResults', {
                                        mapPanel : mapPanel,
                                        fbet: fbet,
                                        aktbet: features[0].attributes.AKTBET,
                                        geometry: features[0].geometry,
                                        layer: mapPanel.drawLayer
                                    });
                                    
                                    var popup = Ext.create('GeoExt.window.Popup', {
                                        title: 'Rapport',
                                        anchored: false,
                                        unpinnable: false,
                                        draggable: true,
                                        map: mapPanel,
                                        maximizable : false,
                                        minimizable : false,
                                        resizable: true,
                                        width: 300,
                                        height: 400,
                                        layout: 'fit',
                                        items: detailReportResults,
                                        collapsible: false
                                    });
                                    
                                    popup.show();
                                }
                            }
                        });
                        
                    },
                    scope: this,
                    callback: function() {
                        mapPanel.setLoading(false);
                    }
                });
            }
        });
        
        config.control = new Click({
            type: OpenLayers.Control.TYPE_TOGGLE
        });
        
        config.iconCls = config.iconCls || 'action-detailreport';
        config.tooltip = config.tooltip || 'Detail report';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
