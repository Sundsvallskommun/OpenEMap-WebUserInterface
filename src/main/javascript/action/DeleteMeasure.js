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
 * Action for delete measurements
 */
Ext.define('OpenEMap.action.DeleteMeasure', {
    extend: 'OpenEMap.action.Action',
    
    constructor : function(config){
        
         config.control = new OpenLayers.Control.Button({
            trigger: function(){
                
                config.mapPanel.measureLayer.removeAllFeatures();
                config.mapPanel.measureLayerSegmentsLayer.removeAllFeatures();

                config.mapPanel.map.layers.forEach(function(l){
                    if(l instanceof OpenLayers.Layer.Vector){
                        // To do clean up
                        if (/OpenLayers.Control.DynamicMeasure/.test(l.name)){
                            l.removeAllFeatures();
                        } else if (/Measure\i/.test(l.name)){
                            l.removeAllFeatures();
                        } else if (l.name === 'OpenLayers.Handler.Path'){
                            l.removeAllFeatures();
                        }
                    }
                });
            }
        });

        config.iconCls = config.iconCls || 'action-deletegeometry';
        config.tooltip = config.tooltip || 'Ta bort m&auml;tning(ar).';
        
        this.callParent(arguments);
    }
});