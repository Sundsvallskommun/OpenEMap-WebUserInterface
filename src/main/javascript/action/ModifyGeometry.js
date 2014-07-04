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
 * Action that modify geometry
 * 
 * Example configuration using experimental support in OL to customize drag and radius handles:
 *    {
 *      "type": "ModifyGeometry",
 *      "reshape": true,
 *      "tooltip": "Redigera geometri",
 *      "options": {
 *        "dragHandleStyle": {
 *          "pointRadius": 8,
 *          "externalGraphic": "css/images/arrow-move.png",
 *          "fillOpacity": 1
 *        },
 *        "radiusHandleStyle": {
 *          "pointRadius": 8,
 *          "externalGraphic": "css/images/arrow-circle.png",
 *          "fillOpacity": 1
 *        }
 *      }
 *    } 
 *    
 * @param {boolean} config.drag Allow dragging of features
 * @param {boolean} config.rotate Allow rotation of features
 * @param {boolean} config.resize Allow resizing of features
 * @param {boolean} config.reshape Allow reshaping of features
 * @param {Object} config.options Additional options to send to OpenLayers.Control.ModifyFeature
 */
Ext.define('OpenEMap.action.ModifyGeometry', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = mapPanel.drawLayer;
        
        if (config.drag === undefined) config.drag = true;
        if (config.rotate === undefined) config.rotate = true;
        if (config.reshape === undefined) config.reshape = true;
        
        var mode = 0;
        if (config.drag) mode = mode | OpenLayers.Control.ModifyFeature.DRAG;
        if (config.rotate) mode = mode | OpenLayers.Control.ModifyFeature.ROTATE;
        if (config.resize) mode = mode | OpenLayers.Control.ModifyFeature.RESIZE;
        if (config.reshape) mode = mode | OpenLayers.Control.ModifyFeature.RESHAPE;
        
        var options = Ext.apply({mode: mode}, config.options);
        config.control = new OpenLayers.Control.ModifyFeature(layer, options);
        config.control._mode = config.control.mode;
        
        config.iconCls = config.iconCls || 'action-modifygeometry';
        config.tooltip = config.tooltip || '&Auml;ndra ritat objekt';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
