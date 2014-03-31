/**
 * Identify action
 * 
 * TODO: Should be generic, is now hardcoded against search-lm parcels
 */
Ext.define('OpenEMap.action.Identify', {
    extend: 'OpenEMap.action.Action',
    requires: ['OpenEMap.view.IdentifyResults'],
    
    constructor: function(config) {
        
        var mapPanel = config.mapPanel;
        var layer = mapPanel.searchLayer;
        var map = config.map;
        var layers = config.layers;
        
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
                
                var identifyResults = Ext.create('OpenEMap.view.IdentifyResults', {
                    mapPanel : mapPanel
                });
                
                var popup = Ext.create('GeoExt.window.Popup', {
                    title: 'Sökresultat',
                    location: feature,
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
                    items: identifyResults,
                    collapsible: false
                });
                
                popup.show();

                OpenEMap.requestLM({
                    url: 'registerenheter?x=' + x + '&y=' + y,
                    success: function(response) {
                        var registerenhet = Ext.decode(response.responseText);

                        var feature = new OpenLayers.Feature.Vector(point, {
                            name: registerenhet.name
                        });
                        identifyResults.addResult([feature], {name:"Fastigheter"});
                    },
                    failure: function(response) {
                        Ext.Msg.alert('Fel', response.statusText);
                    },
                    callback: function() {
                        mapPanel.setLoading(false);
                    }
                });
                
                var parser = Ext.create('OpenEMap.config.Parser');
               
                var wfsLayers =  parser.extractWFS(layers);
                
                var wfsIdentify = function(wfsLayer) {
                    var options = Ext.apply({
                        version: "1.1.0",
                        srsName: "EPSG:3006"
                    }, wfsLayer.wfs);
                    
                    var protocol = new OpenLayers.Protocol.WFS(options);
                    
                    protocol.read({
                        filter: new OpenLayers.Filter({
                            type: OpenLayers.Filter.Spatial.BBOX,
                            value: point.getBounds()
                        }),
                        callback: function(response) {
                            var features = response.features;
                            if (features && features.length>0) {
                                identifyResults.addResult(features, wfsLayer);
                                layer.addFeatures(features);
                            }
                        }
                    });
                };
                
                wfsLayers.forEach(wfsIdentify);
            }
        });
        
        config.control = new Click({
            type: OpenLayers.Control.TYPE_TOGGLE
        });
        
        config.iconCls = config.iconCls || 'action-identify';
        config.tooltip = config.tooltip || 'Identifiera';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
