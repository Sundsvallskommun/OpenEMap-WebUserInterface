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
 * Action in toolbar that zooms the user to full extent
 * 
 * The snippet below is from configuration to MapClient.view.Map
 * 
 * {@img Fullextent.png fullextent}
 * 
 *        "tools": ["FullExtent"]
 */
Ext.define('OpenEMap.action.FullExtent', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        config.control = new OpenLayers.Control.ZoomToMaxExtent();
        
        config.iconCls = config.iconCls || 'action-fullextent';
        config.tooltip = config.tooltip || 'Zooma till full utberedning';
        
        this.callParent(arguments);
    }
});
