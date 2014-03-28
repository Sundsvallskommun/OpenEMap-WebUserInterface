/**
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchAddress', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchaddress',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var registeromrade = Ext.Object.fromQueryString(location.search).registeromrade;
        var layer = this.mapPanel.searchLayer;
        
        function doSearch(fnr, x, y) {
            this.mapPanel.setLoading(true);
            this.mapPanel.searchLayer.destroyFeatures();
            OpenEMap.requestLM({
                url: 'registerenheter?fnr=' + fnr,
                success: function(response) {
                    var json = Ext.decode(response.responseText);
                    if (json.success === false) {
                        Ext.Msg.alert('Meddelande', 'Ingen fastighet kunde hittas på adressen.');
                        return;
                    }
                    this.resultPanel.expand();
                    var features = new OpenLayers.Format.GeoJSON().read(response.responseText, "FeatureCollection");
                    layer.addFeatures(features);
                    var point = new OpenLayers.Geometry.Point(x, y);
                    feature = new OpenLayers.Feature.Vector(point);
                    layer.addFeatures([feature]);
                    this.mapPanel.map.setCenter([x,y], this.zoom || 5);
                },
                failure: function() {
                    Ext.Msg.alert('Fel', 'Okänt.');
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
                url : OpenEMap.basePathLM + 'addresses',
                extraParams: {
                    lmuser: OpenEMap.lmUser
                },
                reader: {
                    type: 'array'
                }
            },
            fields: ['id', 'name', 'x', 'y', 'fnr']
        });
        
        this.labelWidth = 60;
        this.displayField = 'name';
        this.valueField = 'id';
        this.queryParam ='q';
        this.typeAhead = true;
        this.forceSelection = true;
        
        this.listeners = {
            'select':  function(combo, records) {
                doSearch.call(this, records[0].data.fnr, records[0].data.x, records[0].data.y);
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