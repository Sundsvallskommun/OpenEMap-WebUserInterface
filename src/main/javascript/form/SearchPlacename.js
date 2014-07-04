/**
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchPlacename', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchplacename',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var kommunkod;
        var zoom = 5;
        if (this.search && this.search.options) {
            kommunkod = this.search.options.municipalities.join(',');
            zoom = this.search.options.zoom;
        }
                
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url : OpenEMap.basePathLM + 'placenames',
                extraParams: {
                    lmuser: OpenEMap.lmUser,
                    kommunkod: kommunkod
                },
                reader: {
                    type: 'json',
                    root: 'features'
                }
            },
            fields: [
                 {name: 'id', mapping: 'properties.id'},
                 {name: 'name', mapping: 'properties.name'}
             ]
        });
        
        if (this.store.loading && this.store.lastOperation) {
          var requests = Ext.Ajax.requests;
          for (id in requests)
            if (requests.hasOwnProperty(id) && requests[id].options == this.store.lastOperation.request) {
              Ext.Ajax.abort(requests[id]);
            }
        }
        this.store.on('beforeload', function(store, operation) {
          store.lastOperation = operation;
        }, this, { single: true });
        
        this.labelWidth= 60;
        this.displayField= 'name';
        this.valueField= 'id';
        this.queryParam='q';
        this.typeAhead= true;
        this.forceSelection= true;
        
        this.listeners = {
            'select':  function(combo, records) {
                var fake = records[0].raw;
                var coords = fake.geometry.coordinates;
                var switchedAxis = [coords[1], coords[0]];
                this.mapPanel.map.setCenter(switchedAxis, zoom);
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
