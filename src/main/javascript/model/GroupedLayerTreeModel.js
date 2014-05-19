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

        { name: 'layerId' },
    	{ name: 'name', type: 'string' },
        { name: 'isSearchable' },
    	{ name: 'urlToMetadata' },
        { name: 'wms' },
    	{ name: 'wfs' },
        { name: 'serverId' },
        
        { name: 'legendURL' }
    ]
});
