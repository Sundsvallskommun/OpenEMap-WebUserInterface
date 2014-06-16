/**
 * 
 */
Ext.define('OpenEMap.view.IdentifyResults', {
    extend : 'Ext.panel.Panel',
    autoScroll : true,
    layout: {
        type: 'vbox',
        pack:'start',
        align: 'stretch'
    },
    initComponent : function() {
        var store = Ext.create('Ext.data.TreeStore', {
            root : {
                expanded : true
            }
        });
        
        this.root = store.getRootNode();
        
        var propertryGrid = Ext.create('Ext.grid.property.Grid', {
            flex: 2,
            autoScroll : true,
            title: 'Egenskaper',
            collapsible : true,
            collapsed: false,
            xtype : 'propertygrid',
            stripeRows: true,
            clicksToEdit: 100
        });
        
        //propertryGrid.editors = {};
        
        this.items = [{
            xtype : 'treepanel',
            flex: 1,
            rootVisible : false,
            store : store,
            minHeight: 200,
            listeners: {
                select: this.onSelect,
                scope: this
            }
        }, propertryGrid ];

        this.callParent(arguments);
    },
    onSelect: function(model, record, index) {
        var source = {};
        var feature = record.raw.feature;
        var layer = record.raw.layer;
        
        var filterAttributesMeta = function(key) {
            if (layer.metadata.attributes[key]) {
                var alias = layer.metadata.attributes[key].alias || key;
                source[alias] = feature.attributes[key];
            }
        };
        
        if (feature) {
            if (layer.metadata && layer.metadata.attributes) {
                Object.keys(feature.attributes).forEach(filterAttributesMeta);
            } else {
                source = feature.attributes;
            }
            this.mapPanel.searchLayer.selectedFeatures.forEach(function(feature) {
                this.mapPanel.selectControl.unselect(feature);
            }, this);
            if (record.raw.feature.layer) {
                this.mapPanel.selectControl.select(feature);
            }
        }
        
        var source = Ext.clone(source);
        var sourceConfig = Ext.clone(source);
        
        Object.keys(source).forEach(function(key) {
            var value = sourceConfig[key];
            if (value.match('http://') || value.match('//')) {
                source[key] = '<a href="'+value+'" target="_blank">Länk</a>';
                sourceConfig[key] = {
                    renderer: function(value) {return value;},
                    editor: Ext.create('Ext.form.DisplayField')
                };
            } else {
                sourceConfig[key] = {
                    editor: Ext.create('Ext.form.DisplayField')
                };
            }
        });
        
        this.down('propertygrid').setSource(source, sourceConfig);
    },
    /**
     * @param {Array.<OpenLayers.Feature.Vector>} features
     */
    addResult: function(features, layer) {
        var layerNode = this.root.appendChild({
            text: layer.name,
            leaf: false,
            expanded : true
        });
        
        var processFeature = function(feature) {
            layerNode.appendChild({
                text: feature.attributes[Object.keys(feature.attributes)[0]],
                leaf: true,
                feature: feature,
                layer: layer
            });
        };
        
        features.forEach(processFeature);
    }
});