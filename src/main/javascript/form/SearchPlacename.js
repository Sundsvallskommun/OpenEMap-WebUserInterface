/**
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchPlacename', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchplacename',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var kommunkod = Ext.Object.fromQueryString(location.search).kommunkod;
                
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
                this.mapPanel.map.setCenter(switchedAxis, this.zoom || 5);
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});