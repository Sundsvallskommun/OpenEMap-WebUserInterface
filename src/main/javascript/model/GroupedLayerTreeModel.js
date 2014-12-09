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
 * OpenEMap layer configuration model
 * Adds layer configuration specific fields
 */

Ext.define('OpenEMap.model.GroupedLayerTreeModel' ,{
    extend: 'Ext.data.Model',

    fields: [ 
    	{ name: 'text', type: 'string' },
    	{ name: 'checkedGroup', type: 'string' },
    	{ name: 'layer' },
    	{ name: 'queryable', type: 'boolean' },
    	{ name: 'isGroupLayer', type: 'boolean' },

        { name: 'layerId' },
    	{ name: 'name', type: 'string' },
        { name: 'isSearchable' },
    	{ name: 'urlToMetadata' },
        { name: 'wms' },
    	{ name: 'wfs' },
        { name: 'serverId' },
        
        { name: 'legendURL' },
        { name: 'layers'}
    ]
});
