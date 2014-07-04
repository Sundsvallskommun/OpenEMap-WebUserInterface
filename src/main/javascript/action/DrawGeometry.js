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
 * Action for draw geometry
 * 
 * The snippet below is from configuration to MapClient.view.Map
 *
 *         "tools" : [{
 *           "type": "DrawGeometry",
 *           "geometry": "Path",
 *           "tooltip": "Markera väg",
 *           "attributes": {
 *             "type": "Väg"
 *             "metadata": {
 *               "type": {
 *                 "hidden": true
 *               }
 *             }
 *           }
 *       }]
 *       
 * NOTE: metadata attribute can be used to hide another attributes from showing up in ObjectConfig dialog.
 *  
 * DrawGeometry can also be used to draw text features, since they are simply point features with an attribute to be labeled with styling.
 */
Ext.define('OpenEMap.action.DrawGeometry', {
    extend: 'OpenEMap.action.Action',

    isText : function(feature){
        if (feature){
            var isPoint = feature.geometry === 'Point' || feature.geometry instanceof OpenLayers.Geometry.Point;
            if (isPoint){
                var isText =  feature.attributes && 
                    feature.attributes.type && 
                    feature.attributes.type === 'label';
                return isText;
            }
        }
        return false;
    },

    /**
     * @param config
     * @param {string} config.typeAttribute string to write to new feature attribute type
     * @param {boolean} config.singleObject Set to true to clear layer before adding feature effectively restricing 
     */
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = mapPanel.drawLayer;


        config.attributes = config.attributes || {};
        
        config.geometry = config.geometry || 'Polygon';
        
        var Control = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
            // NOTE: override drawFeature to set custom attributes
            drawFeature: function(geometry) {
                var feature = new OpenLayers.Feature.Vector(geometry, config.attributes, config.style);
                var proceed = this.layer.events.triggerEvent(
                    "sketchcomplete", {feature: feature}
                );
                if(proceed !== false) {
                    feature.state = OpenLayers.State.INSERT;
                    this.layer.addFeatures([feature]);
                    this.featureAdded(feature);
                    this.events.triggerEvent("featureadded",{feature : feature});
                }
            }
        });
        
        config.control = new Control(layer, OpenLayers.Handler[config.geometry]);

        layer.events.register('beforefeatureadded', this, function(evt){
            if (this.isText(evt.feature)){
                Ext.Msg.prompt('Text', 'Mata in text:', function(btn, text){
                    if (btn == 'ok'){
                        evt.feature.attributes.label = text;
                        evt.feature.data.label = text;
                        layer.redraw();
                    }
                });
            }
        });
        
                
        config.iconCls = config.iconCls || 'action-drawgeometry';
       
       if (!config.tooltip){
       		config.tooltip = config.geometry === 'Polygon' ? 'Rita område' :
         		config.geometry === 'Path' ? 'Rita linje' :
         		config.geometry === 'Point' ? 'Rita punkt' : 'Rita geometri';
         		
         	if (this.isText(config)){
         		config.tooltip = 'Placera ut text.';	
         	}
       }
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
