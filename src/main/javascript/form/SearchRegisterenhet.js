/**
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchRegisterenhet', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchregisterenhet',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        //var registeromrade = Ext.Object.fromQueryString(location.search).registeromrade;
        var registeromrade = this.filterMunicipalities.join(',');
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
                    if (this.zoom) {
                        this.mapPanel.map.setCenter(extent.getCenterLonLat(), this.zoom);
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