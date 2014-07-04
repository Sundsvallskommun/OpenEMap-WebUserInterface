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
 * Server configuration store
 * Stores server configruations
 */

Ext.define('OpenEMap.data.Servers' ,{
    extend: 'Ext.data.Store',

    requires: [
        'OpenEMap.model.Server'
    ],

    model: 'OpenEMap.model.Server',

    storeId: 'servers',

    singelton: true,

    constructor: function(config) {
        config = Ext.apply(this, config);
        if(this.url) {
            this.proxy = {
                type: 'ajax',
                url: this.url,
                reader: {
                    type: 'json',
                    root: 'configs'
                }
            };
        }
        this.callParent([config]);
    }
});