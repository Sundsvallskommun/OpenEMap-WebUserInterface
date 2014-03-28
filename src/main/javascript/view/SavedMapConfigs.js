Ext.define('OpenEMap.view.SavedMapConfigs' ,{
    extend: 'Ext.grid.Panel',
    
    autoScroll: true,
    hideHeaders: true,

    id: 'savedMapConfigsGrid',

	selModel: Ext.create('Ext.selection.CheckboxModel', {
		mode: 'SINGLE',
        checkOnly: true,
		listeners: { 
			select: function( t, record, index, eOpts ) {
				var configId = record.get('configId');
				init(OpenEMap.wsUrls.basePath + OpenEMap.wsUrls.configs + '/' + configId);
			}
		}
	}),
	
	store: Ext.create('OpenEMap.data.SavedMapConfigs'),
    columns: [
        { 
        	header: 'Name',  
        	dataIndex: 'name',
        	flex: 1
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
    ],

    constructor: function() {
    	this.callParent(arguments);
    }
});