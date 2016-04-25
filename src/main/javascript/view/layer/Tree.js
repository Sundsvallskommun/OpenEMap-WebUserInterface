/*    
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
Ext.define('OpenEMap.view.layer.Tree' ,{
    extend: 'Ext.tree.Panel',
    requires: [
        'OpenEMap.data.GroupedLayerTree',
        'GeoExt.tree.Column'
    ],
    rootVisible: false,
    hideHeaders: true,
    initComponent: function() {
        if(!this.store && this.mapPanel) {
            this.store = Ext.create('OpenEMap.data.GroupedLayerTree', {
                root: {
                    text: (this.mapPanel.config && this.mapPanel.config.name ? this.mapPanel.config.name : 'Lager'),
                    expanded: true,
                    isGroupLayer: true,
                    layers: this.mapPanel.map.layerSwitcherLayerTree
                },
                map: this.mapPanel.map
            });
        }

        // Bug fix preventing layer selector scrolling to top when checking/unchecking/expanding/collapsing tree nodes
        this.on('viewready', function(tree, eOpts) {
            if((tree.$className === 'OpenEMap.view.layer.Tree' || tree.$className === 'OpenEMap.view.layer.Basic') &&
              !tree.view.hasLoadingHeight) {
                tree.view.hasLoadingHeight = true;
            }
        });

        this.on('checkchange', function(node, checked, eOpts) {
            // If group layer visibility toggling is disabled, do not handle this click
            if(node.data.isGroupLayer && !node.data.toggleGroupEnabled) {
                node.set('checked', !checked);
                return;
            }

            // Loop this node and children
            node.cascadeBy(function(n){

                n.set('checked', checked);
                var olLayerRef = n.get('layer');
                // Change layer visibility (Layer groups have no layer reference)
                if(olLayerRef) {
                    olLayerRef.setVisibility(checked);
                  	olLayerRef.options.visibility = checked;
                }
                var wms = n.get('wms');
                if (wms) {
                    wms.options.visibility = checked;
                }

           	});
           
           	function checkParent(n, checked) {
	            var parent = n.parentNode;

	            if (parent.get("checked") != n.get("checked")) {
		           	if (checked) {
		           	    // check parent if not root
		            	if (!parent.isRoot()) {
		                	parent.set("checked", checked);
		                	checkParent(parent, checked);
		               	}
		           	} else {
		               	if (!parent.isRoot() && !parent.childNodes.some(function(node) { return node.get('checked'); })) {
		                   	parent.set("checked", checked);
		                   	checkParent(parent, checked);
		               	}
		           	}
	            }
	       	}
           	// Checking/unchecking parent node
			checkParent(node, checked);
			
        });

        this.on('cellclick', function(tree, td, cellIndex, node, el, columnIndex, e) {
            // Setting default legendDelay to 5 seconds
            if (typeof this.legendDelay === 'undefined' || this.legendDelay === null) {
            	this.legendDelay = 5000;
            }
            // function to create legend tooltip
            var createLegend = function(url, legendDelay) {
                var img = Ext.create('Ext.Img', {
                    src: url
                });
                var tip = Ext.create('Ext.tip.ToolTip', {
                    title: 'Legend ' + node.raw.name,
                    closable: true,
                    dismissDelay: legendDelay,
                    items: img
                });
                tip.showBy(el);
                img.getEl().on('load', function() {
                    tip.doLayout();
                });
            };
            
            // function to get legend url
            // TODO: could share code with inline legend creation in GroupedLayerTree
            var getLegendUrl = function(node) {
                var layer = node.raw.layer;
                var url;
                if (layer.legendURL !== undefined) {
                    url = layer.legendURL;
                } else if (node.raw.wms && (node.raw.wms.params.LAYERS || node.raw.wms.params.layers)) {
                    var layerRecord = GeoExt.data.LayerModel.createFromLayer(layer);
                    var legend = Ext.create('GeoExt.container.WmsLegend', {
                        layerRecord: layerRecord,
                        useScaleParameter: false
                    });
                    url = legend.getLegendUrl(node.raw.wms.params.LAYERS || node.raw.wms.params.layers);
                }
                return url;
            };
        
            // Get target element in an IE9 compatible way
            var target = e.browserEvent.target || e.browserEvent.srcElement;
            
            // check if target is the inline legend image
            if (Ext.get(target).hasCls('legendimg') && node.raw.layer) {
                var url = getLegendUrl(node);
                if (url && url.length > 0) {
                    createLegend(url, this.legendDelay);
                }
            }
        });
        
        this.callParent(arguments);
    },
    getBaseLayersConfiguration: function() {
        var layerConfigs = [];

        function configAddLayer(layer) {
	        var layerCfg = {
	            name: layer.name,
	            wms: {
	            	url: layer.url, 
	            	options: layer.options, 
	            	params: layer.params
	        	},
            	visibility: layer.visibility
	        };
			layerCfg.wms.options.visibility = layer.visibility; 
			return layerCfg;
        }

        var baseLayers = this.mapPanel.map.layers.filter(function(layer) { return layer.isBaseLayer; });
        for (var i=0; i<baseLayers.length;i++) {
	        layerConfigs.unshift(configAddLayer(baseLayers[i]));
        }
	    return layerConfigs;
    },

    getConfig: function(includeLayerRef) {
    	// Start with initial config to get a complete config object
        var config = Ext.clone(this.client.initialConfig);
        
        // Get layers config from layer tree, to reflect changes made by user   
       	var layers = this.getStore().getLayerConfiguration(includeLayerRef);

        // layer tree does not include base layers so extract them from initial config
    	var baseLayers = config.layers.filter(function(layer) {
    		return (layer.wms && layer.wms.options && layer.wms.options.isBaseLayer) ? layer : false;
    	});
    	
    	baseLayers = this.getBaseLayersConfiguration();
    	
    	config.layers = baseLayers.concat(layers);
    	
    	return config;
    }
});
