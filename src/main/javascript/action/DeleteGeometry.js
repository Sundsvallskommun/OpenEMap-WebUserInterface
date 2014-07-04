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
 * Action to delete geometry
 * 
 * The snippet below is from configuration to MapClient.view.Map
 * 
 *      "tools" : [{
 *            "type": "DeleteGeometry",
 *            "tooltip": "Ta bort valt objekt/geometri"
 *        }]
 */
Ext.define('OpenEMap.action.DeleteGeometry', {
    extend: 'OpenEMap.action.Action',
    /**
     * @param config
     * @param {string} config.typeAttribute string to write to new feature attribute type
     */
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = mapPanel.drawLayer;
        
        config.handler = function() {
            layer.selectedFeatures.forEach(function(feature) {
                mapPanel.map.controls.forEach(function(control) {
                    if (control.CLASS_NAME == "OpenLayers.Control.ModifyFeature" && control.active) {
                        control.unselectFeature(feature);
                    }
                });
                layer.destroyFeatures([feature]);
            });
        };
        
        config.iconCls = config.iconCls || 'action-deletegeometry';
        config.tooltip = config.tooltip || 'Ta bort ritat objekt';
        
        this.callParent(arguments);
    }
});
