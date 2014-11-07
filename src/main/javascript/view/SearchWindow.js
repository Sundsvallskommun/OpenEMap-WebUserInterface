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
Ext.define('OpenEMap.view.SearchWindow' ,{
	extend: 'Ext.Window',

    requires: [
        'Ext.tab.Panel',
        'OpenEMap.form.Search'
    ],

	title: 'Search',
	width: 300,
	height: 100,
	border: 0,
    layout: 'fit',
	closeAction: 'hide',

    initComponent : function() {
        this.items = [{ 
            xtype: 'search',
            mapPanel : this.mapPanel
        }];

        this.callParent(arguments);
    }
});
