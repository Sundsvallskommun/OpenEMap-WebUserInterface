/**
 * 
 */
Ext.define('OpenEMap.view.DetailReportResults', {
    extend : 'Ext.view.View',
    autoScroll : true,
    padding: 5,
    geometry: null,
    initComponent : function() {
        this.store = Ext.create('GeoExt.data.FeatureStore', {
            features: [],
            fields: ['COUNT',
                     'CATEGORY',
                     'CLARIFICAT',
                     'DESCRIPTIO',
                     'REMARK',
                     'MAPTEXT',
                     'MAX',
                     'MIN',
                     'HEIGHT'
                     ]
        });
        
        this.tpl = new Ext.XTemplate(
                '<h3>' + this.fbet + '</h3>',
                '<h4>' + this.aktbet + '</h4>',
                '<tpl for=".">',
                    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
                      '<h4>{COUNT}. {DESCRIPTIO}</h4>',
                      '<p>{REMARK}</p>',
                    '</div>',
                '</tpl>'
            );
        this.itemSelector = 'div.thumb-wrap';

        this.callParent(arguments);
        
        this.doSearch();
    },
    
    doSearch: function() {
        var store = this.store;
        var layer = this.layer;
        var geometry = this.geometry;
        
        layer.destroyFeatures();
        
        var options = Ext.apply({
            url: "wfs",
            version: "1.1.0",
            srsName: "EPSG:3006",
            featureType: "EgenskapsBestammelser_yta",
            featurePrefix: "RIGES"
        });
        
        var protocol = new OpenLayers.Protocol.WFS(options);
        
        protocol.read({
            filter: new OpenLayers.Filter({
                type: OpenLayers.Filter.Spatial.INTERSECTS,
                value: geometry
            }),
            callback: function(response) {
                var features = response.features;
                if (!features) return;
                features.forEach(function(feature) {
                    feature.attributes.COUNT = store.getCount()+1;
                    store.addFeatures([feature]);
                });
                layer.addFeatures(features);
            }
        });
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
    }
});