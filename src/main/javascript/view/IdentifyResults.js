﻿/*    
    Copyright (C) 2014 Härnösands kommun

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * 
 */
Ext.define('OpenEMap.view.IdentifyResults', {
    extend : 'Ext.panel.Panel',
    autoScroll : true,
    layout: {
        type: 'vbox',
        pack:'start',
        align: 'stretch',
        resizable: true
    },
    initComponent : function() {
        var store = Ext.create('Ext.data.TreeStore', {
            root : {
                expanded : true
            }
        });
        
        this.root = store.getRootNode();
        
        var propertyGrid = Ext.create('Ext.grid.property.Grid', {
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
        }, propertyGrid ];

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
        
        source = Ext.clone(source);
        var sourceConfig = Ext.clone(source);
        
        Object.keys(source).forEach(function(key) {
            var value = sourceConfig[key];
            value = value ? value : '';
            if (value.match('http://') || value.match('//') || value.match('https://')) {
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
        
        var getMainAttribute = function(feature, layer) {
        	var str = '';
        	if (layer.metadata && layer.metadata.attributes) {
        		var mainAttributes = [];
	        	for (var attribute in layer.metadata.attributes) {
	        		if (layer.metadata.attributes[attribute].mainAttribute) {
	        			mainAttributes.push(attribute);
	        		}
	        	}
	        	for (attribute in feature.attributes) {
	        		for (var index in mainAttributes) {
		        		if (attribute === mainAttributes[index]) {
		        			str += feature.attributes[attribute] + ' ';
		        		}
	        		}
	        	}
        	}
        	
        	if (str === '') {
        		str = feature.attributes[Object.keys(feature.attributes)[0]]; // If no main attribute is specified use the first
        	}
        	
        	str.trim();
        	return str;
        };
        
        var processFeature = function(feature) {
            layerNode.appendChild({
                text: getMainAttribute(feature, layer),
                leaf: true,
                feature: feature,
                layer: layer
            });
        };
        
        // TODO - add code to specify main attribute
		        
        features.forEach(processFeature);
    }
});
