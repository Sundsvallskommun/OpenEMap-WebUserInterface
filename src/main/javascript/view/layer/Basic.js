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
Ext.define('OpenEMap.view.layer.Basic' ,{
    extend: 'OpenEMap.view.layer.Tree',

    rootVisible: false,
    width: 300,
	resizable: true,
	resizeHandles: 's',
	listeners: {
		afterrender: function() {
	    	this.gui.fireEvent('layerControlLoaded', this);
		}
	},

    initComponent: function() {
    	this.setLoading(true);
        if (!this.renderTo) {
            this.title = 'Lager';
            this.bodyPadding = 5;
            this.collapsible = true;
        }
        
        this.callParent(arguments);
    }


});