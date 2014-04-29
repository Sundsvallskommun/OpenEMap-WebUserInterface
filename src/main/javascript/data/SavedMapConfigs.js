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

    proxy: {
        type: 'rest',
        appendId: true,
        url: (OpenEMap && OpenEMap.wsUrls && OpenEMap.wsUrls.basePath) ? OpenEMap.wsUrls.basePath : '' + 
        		(OpenEMap && OpenEMap.wsUrls && OpenEMap.wsUrls.configs) ? OpenEMap.wsUrls.configs : '',
        reader: {
            type: 'json',
            root: 'configs'
        },
        writer: {            
            type: 'json'
        }
    }
});