/**
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchRegisterenhet', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchregisterenhet',
    require: ['Ext.data.*',
              'Ext.form.*'],
    queryDelay: 800,
    initComponent : function() {
        var registeromrade;
        var zoom;
        if (this.search && this.search.options){
            registeromrade = this.search.options.municipalities.join(',');
            zoom = this.search.options.zoom;
        }
        var layer = this.mapPanel.searchLayer;
        
        function doSearch(id) {
            this.mapPanel.setLoading(true);
            this.mapPanel.searchLayer.destroyFeatures();
            OpenEMap.requestLM({
                url: 'registerenheter/' + id + '/enhetsomraden?',
                success: function(response) {
                    this.resultPanel.expand();
                    var features = new OpenLayers.Format.GeoJSON().read(response.responseText);
                    layer.addFeatures(features);
                    var extent = layer.getDataExtent();
                    if (zoom) {
                        this.mapPanel.map.setCenter(extent.getCenterLonLat(), zoom);
                    } else {
                        this.mapPanel.map.zoomToExtent(extent);
                    }
                },
                failure: function() {
                    Ext.Msg.alert('Fel', 'Ingen träff.');
                },
                callback: function() {
                    this.mapPanel.setLoading(false);
                },
                scope: this
            });
        }
        
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url : OpenEMap.basePathLM + 'registerenheter',
                extraParams: {
                    lmuser: OpenEMap.lmUser
                },
                reader: {
                    type: 'json',
                    root: 'features'
                }
            },
            fields: [
                 {name: 'id', mapping: 'properties.objid'},
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
        
        this.labelWidth = 60;
        this.displayField = 'name';
        this.valueField = 'id';
        this.queryParam = 'q';
        this.typeAhead = true;
        this.forceSelection = true;
        
        this.listeners = {
            'select':  function(combo, records) {
                var id = records[0].get('id');
                doSearch.call(this, id);
            },
            'beforequery': function(queryPlan) {
                if (registeromrade && queryPlan.query.match(registeromrade) === null) {
                    queryPlan.query = registeromrade + ' ' + queryPlan.query;
                }
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
