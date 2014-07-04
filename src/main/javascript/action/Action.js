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
 * Base class for adding common functionality upon GeoExt.Action
 * 
 * @param {string} config.minScale disable tool below this scale
 * @param {string} config.maxScale disable tool above this scale
 */
Ext.define('OpenEMap.action.Action', {
    extend: 'GeoExt.Action',
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var map = mapPanel.map;
                
        if (config.minScale || config.maxScale) {
            if (!config.minScale) config.minScale = 0;
            if (!config.maxScale) config.maxScale = 99999999999999;
            
            var onZoomend = function() {
                if (map.getScale() >= config.maxScale ||
                    map.getScale() <= config.minScale) {
                    this.disable();
                } else {
                    this.enable();
                }
            };
            
            map.events.register('zoomend', this, onZoomend);
        }
        
        this.callParent(arguments);
    },
    /**
     * To be implemented by actions that need special logic on toggle
     * @abstract
     */
    toggle: function() {}
});
