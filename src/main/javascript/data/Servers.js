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