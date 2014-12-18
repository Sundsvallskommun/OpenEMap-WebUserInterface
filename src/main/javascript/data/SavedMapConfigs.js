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
//@requires OpenEMap

/**
 * Map configuration store
 * Store to list map configurations
 */

Ext.define('OpenEMap.data.SavedMapConfigs' ,{
    extend: 'Ext.data.Store',

    requires: [
        'OpenEMap.model.MapConfig'
    ],

    model: 'OpenEMap.model.MapConfig',

    storeId: 'savedMapConfigs',

    autoLoad: true,
    
    constructor: function(config) {
        this.proxy = {
            type: 'rest',
            appendId: true,
	        url: ((OpenEMap && OpenEMap.wsUrls && OpenEMap.wsUrls.basePath) ? OpenEMap.wsUrls.basePath : '') + 
	        		((OpenEMap && OpenEMap.wsUrls && OpenEMap.wsUrls.adminconfigs) ? OpenEMap.wsUrls.adminconfigs : ''),
            reader: {
                type: 'json',
                root: 'configs'
            },
            writer: {            
                type: 'json'
            }
        };
        this.callParent(arguments);
    }
});
