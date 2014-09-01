/*    
    Copyright (C) 2014 Härnösands kommun

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * Identify action
 * 
 * @param config
 * @param {string} config.useRegisterenhet wheter or not to use identify on registerenhet 
 * @param {string} config.tolerance tolerance to use when identifying in map. Defaults to 5 meter. 
 *                 Creates a bounding box with the specified tolerance as sidelengths
 */
Ext.define('OpenEMap.action.Identify', {
    extend: 'OpenEMap.action.Action',
    requires: ['OpenEMap.view.IdentifyResults'],
    popup : null,
    
    getPopup : function(config){
        if (this.popup){
            this.popup.destroy();
        }
        this.popup = Ext.create('GeoExt.window.Popup', {
            title: 'Sökresultat',
            location: config.feature,
            anchored: false,
            unpinnable: false,
            draggable: true,
            map: config.mapPanel,
            maximizable : false,
            minimizable : false,
            resizable: true,
            width: 300,
            height: 400,
            layout: 'fit',
            items: config.items,
            collapsible: false,
            x : 200,
            y: 100,
            listeners : {
                close : function(){
                    config.mapPanel.searchLayer.removeAllFeatures();
                }
            }
        });

        return this.popup;
    },

    
    constructor: function(config) {
        var self = this;

        var mapPanel = config.mapPanel;
        var layer = mapPanel.searchLayer;
        var map = config.map;
        var layers = config.layers;
        
        // Defaults to identify registerenhet
        if (config.useRegisterenhet == null) {
        	config.useRegisterenhet = true;
        }
        
        // Defaults to 5 meter tolerance
        config.tolerance = config.tolerance || 5.0;  

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
		        // Flag to set if any of the searches return hits, so we can tell the user if the search doesn't return any hits
		        var hits = false;  
                
                // Show graphhic for start loading
                mapPanel.setLoading(true);
                layer.destroyFeatures();
                
                var lonlat = map.getLonLatFromPixel(evt.xy);
                
                var x = lonlat.lon;
                var y = lonlat.lat;
                
                // Create search bounds for identify
                var point = new OpenLayers.Geometry.Point(x, y);
                var lowerLeft = point.clone();
                var upperRight = point.clone();
                lowerLeft.move(-config.tolerance/2,-config.tolerance/2);
                upperRight.move(config.tolerance/2,config.tolerance/2);
                var bounds = new OpenLayers.Bounds();
                bounds.extend(lowerLeft);
                bounds.extend(upperRight);

                var feature = new OpenLayers.Feature.Vector(point);
                layer.addFeatures([feature]);
                
                var identifyResults = Ext.create('OpenEMap.view.IdentifyResults', {
                    mapPanel : mapPanel
                });

                var popup = self.getPopup({mapPanel : mapPanel, location: feature, items: identifyResults});
                popup.show();

				// Identify registerenhet
				if (config.useRegisterenhet) {
	                OpenEMap.requestLM({
	                    url: 'registerenheter?x=' + x + '&y=' + y,
	                    success: function(response) {
	                        var registerenhet = Ext.decode(response.responseText);
	
	                        var feature = new OpenLayers.Feature.Vector(point, {
	                            name: registerenhet.name
	                        });
	                        identifyResults.addResult([feature], {name:"Fastigheter"});
	                        hits = true;
	                    },
	                    failure: function(response) {
	                        Ext.Msg.alert('Fel i fastighetstjänsten', 'Kontakta systemadministratör<br>Felkod: ' + response.status + ' ' + response.statusText);
	                    }
	                });
                }
               
               // Identify WFS-layers in map
                var parser = Ext.create('OpenEMap.config.Parser');
               
                // TODO - only return layers that are visible 
                var wfsLayers =  parser.extractWFS(layers);
                
                var wfsIdentify = function(wfsLayer) {
                    var options = Ext.apply({
                        version: "1.1.0",
                        srsName: map.projection,
                    }, wfsLayer.wfs);
                    
                    var protocol = new OpenLayers.Protocol.WFS(options);
                    
                    protocol.read({
                        filter: new OpenLayers.Filter({
                            type: OpenLayers.Filter.Spatial.BBOX,
                            value: bounds
                        }),
                        callback: function(response) {
                            var features = response.features;
                            if (features && features.length>0) {
                                identifyResults.addResult(features, wfsLayer);
                                layer.addFeatures(features);
                                hits = true;
                            }
                        }
                    });
                };
                
                wfsLayers.forEach(wfsIdentify);
             	
				// Show message if there are no hits
				if (!hits) {
					identifyResults.addResult([], {name:"Inga träffar"});
				}
             	   
                // Hide graphhic for loading
				mapPanel.setLoading(false);
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
