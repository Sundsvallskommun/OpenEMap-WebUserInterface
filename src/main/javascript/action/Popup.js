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
 * @author Anders Erlandsson, Sundsvalls kommun 
 */

/** 
 * @title Popup action
 * @abstract This action is triggered when a feature of an vectorPopup layer is clicked in the map.
 * A vectorPopup layer must contain an property named popupTextAttribute. Each feature shall have
 * an attribute whit that name that holds the information that should be shown in the popup. 
 * The layer may also contain popupAttributePrefix and popupAttributeSuffix that will be presented
 * as constant text before and after the popupTextAttribute
 * @param {Object} [config] configuration of the popup behaviour   
 * @param {Number} [config.tolerance=3] tolerance to use when identifying in map. Radius in image pixels.
 * @event popupfeatureselected fires event if a feature is found
 */
Ext.define('OpenEMap.action.Popup', {
    extend: 'OpenEMap.action.Action',
    requires: ['OpenEMap.view.PopupResults'],
    popup: null,
    map: null,
    constructor: function(config) {
        var self = this;
        map = config.map;
        var mapPanel = config.mapPanel;
        var layers = config.layers;
        config.popup = null;

        // Defaults to 3 pixels tolerance
        config.tolerance = config.tolerance || 3;  
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
            	var lonlat = map.getLonLatFromPixel(evt.xy);
                layers = map.layers;
                
                var x = lonlat.lon;
                var y = lonlat.lat;
                var clkPoint = new OpenLayers.Geometry.Point(x, y);
                var clkFeature = new OpenLayers.Feature.Vector(clkPoint);

				// Buffering click point with tolerance  
				var lowerLeftImage = {};
				var upperRightImage = {};
				upperRightImage.x = evt.xy.x+config.tolerance;
                lowerLeftImage.x = evt.xy.x-config.tolerance;
                upperRightImage.y = evt.xy.y+config.tolerance;
                lowerLeftImage.y = evt.xy.y-config.tolerance;
                var lowerLeftLonLat = map.getLonLatFromPixel(lowerLeftImage);
                var upperRightLonLat = map.getLonLatFromPixel(upperRightImage);

                
                // Create search bounds for identify
                var bounds = new OpenLayers.Bounds();
                bounds.extend(lowerLeftLonLat);
                bounds.extend(upperRightLonLat);
                
                // get popup layers 
                var parser = Ext.create('OpenEMap.config.Parser');
                var popupLayers = parser.extractPopupLayers(layers);
                
                var hitFound =  false;
                var popupIdentify = function(popupLayer) {
                	// identify features in popup layers
			    	if (popupLayer.popup && config.showOnlyFirstHit) { 
						// Remove popup window
						popupLayer.popup.forEach(function(p) {p.destroy();p = null;});
						popupLayer.popup = [];
			    	}
                	var popupFeature = function(feature) {
                		if (config.showOnlyFirstHit) {
				    		// Remove highlight feature
				    		feature.renderIntent = 'default';
				    		feature.layer.drawFeature(feature);
                		}
				    	if (!(hitFound && config.showOnlyFirstHit)) {
	                		if (feature.geometry.intersects(bounds.toGeometry())) {
						    	// get text to populate popup 
	                			var popupText = popupLayer.popupTextPrefix+feature.attributes[popupLayer.popupTextAttribute]+popupLayer.popupTextSuffix;
						    	var popupTitle = '';
						    	if (popupLayer.popupTitleAttribute) {
						    		popupTitle = feature.attributes[popupLayer.popupTitleAttribute];
						    	}
						    	// Create popup 
						    	var popup = new OpenEMap.view.PopupResults({mapPanel : mapPanel, location: clkFeature, popupText: popupText, feature: feature, title: popupTitle});
						
								// Show popup
						        popup.show();
								
								// Adds popup to array of popups in map  
						        popupLayer.popup.push(popup);
						        
					    		// Highlight feature
					    		feature.renderIntent = 'select';
					    		feature.layer.drawFeature(feature);
						    	
						    	// Fire action "popupfeatureselected" on the feature including layer and featureid
						    	map.events.triggerEvent("popupfeatureselected",{layer: popupLayer, featureid: feature.attributes[popupLayer.idAttribute]});
			                	return true;
		                	} else  {
		                		return false;	
		                	}
				    	}
                	}
					
					// Loop throgh each feature in the layer
                	var featureIndex=0;
                	while (featureIndex < popupLayer.features.length) {
                		hitFound = popupFeature(popupLayer.features[featureIndex]);
                		featureIndex++;	
                	}
                	return hitFound;
                }
                
                // Loop through each popupLayer
            	var layerIndex=0;
            	while (layerIndex<popupLayers.length) {
            		hitFound = popupIdentify(popupLayers[layerIndex]);
            		layerIndex++;
            	}
            }
        });
        
        config.control = new Click({
            type: OpenLayers.Control.TYPE_TOGGLE
        });
        
        config.iconCls = config.iconCls || 'action-popup';
        config.tooltip = config.tooltip || 'Popup';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    },
    
    // TODO cleanup on close?
    destroy: function() {
        if (this.popup){
            this.popup.destroy();
        }
    	this.destroyPopupLayers();
    }
    //this.popup.destroy();
    
});
