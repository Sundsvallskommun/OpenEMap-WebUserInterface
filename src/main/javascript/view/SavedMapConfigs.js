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
 * @class OpenEMap.view.SavedMapConfigs
 */
Ext.define('OpenEMap.view.SavedMapConfigs' ,{
    extend: 'Ext.grid.Panel',
    requires: ['OpenEMap.data.SavedMapConfigs'],
    autoScroll: true,
    hideHeaders: true,

    id: 'savedMapConfigsGrid',

    constructor: function() {
        /*this.selModel = Ext.create('Ext.selection.CheckboxModel', {
		    mode: 'SINGLE',
            checkOnly: true,
		    listeners: { 
			    select: function( t, record, index, eOpts ) {
			        this.client.destroy();
			        this.client.configure(record.raw, this.client.initialOptions);
				    //var configId = record.get('configId');
				    //init(OpenEMap.wsUrls.basePath + OpenEMap.wsUrls.configs + '/' + configId);
			    },
			    scope: this
		    }
	    });*/
	
	    this.store = Ext.create('OpenEMap.data.SavedMapConfigs');
        this.columns = [
            { 
            	header: 'Name',  
            	dataIndex: 'name',
            	flex: 1
            },
            {
                xtype: 'actioncolumn',
                width: 40,
                iconCls: 'action-load',
                tooltip: 'Ladda',
                handler: function(grid, rowIndex, cellIndex, column, e, record, tr) {
                    this.client.destroy();
			        this.client.configure(record.raw, this.client.initialOptions);
                    e.stopEvent();
                    return false;
                }.bind(this)
            },
            {
                xtype: 'actioncolumn',
                width: 40,
                iconCls: 'action-remove',
                tooltip: 'Ta bort',
                handler: function(grid, rowIndex, cellIndex, column, e, record, tr) {
                    //TODO! change to proper rest store delete
                    Ext.MessageBox.confirm('Ta bort', 'Vill du verkligen ta bort konfigurationen?', function(btn) {
                        if(btn === 'yes') {
                            var store = grid.getStore();
                            grid.panel.dataHandler.deleteConfiguration(record.get('configId'),{ configId: record.get('configId') });
                            store.removeAt(rowIndex);
                        }
                    });
                    e.stopEvent();
                    return false;
                }
            }
        ];
    
    	this.callParent(arguments);
    }
});
