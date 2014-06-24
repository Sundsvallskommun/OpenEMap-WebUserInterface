//@define OpenEMap
Ext.ns('OpenEMap');

Ext.apply(OpenEMap, {
    lmUser: 'sundsvall',
    /**
     * Base path to be used for mapfish print servlet requests
     * 
     * @property {string}
     */
    basePathMapFish: '/print/pdf',
    /**
     * Base path to be used for all AJAX requests against search-lm REST API
     * 
     * @property {string}
     */
    basePathLM: '/search/lm/',
    /**
     * Base path to be used for all image resources
     * 
     * @property {string}
     */
    basePathImages: 'resources/images/',

    /**
     * WS paths to be used for AJAX requests
     * 
     * @property {object}
     */
    wsUrls: {
        basePath:   '/openemapadmin/',
        configs:    'configs',
        servers:    'settings/servers',
        layers:     'layers/layers',
        metadata:   'geometadata/getmetadatabyid', 
        metadata_abstract: 'geometadata/getabstractbyid'
    }
});

Ext.apply(OpenEMap, {
    /**
     * Wrapped Ext.Ajax.request method that applies base path and user
     */
    requestLM: function(config) {
        config.url = OpenEMap.basePathLM + config.url + '&lmuser=' + OpenEMap.lmUser;
        Ext.Ajax.request(config);
    }
});
