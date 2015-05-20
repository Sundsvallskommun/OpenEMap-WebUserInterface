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
 * Grouped layer tree store
 * Ext.data.TreeStore extended to support OpenEMap layer configuration including layer groups
 */

Ext.define('OpenEMap.data.GroupedLayerTree' ,{
    extend: 'Ext.data.TreeStore',

    requires: [
        'GeoExt.container.WmsLegend',
        'OpenEMap.model.GroupedLayerTreeModel'
    ],

    model: 'OpenEMap.model.GroupedLayerTreeModel',
    defaultRootProperty: 'layers',

    proxy: {
        type: 'memory'
    },

    maxLayerIndex: 1000,

    listeners: {
        beforeinsert: function(store, node, refNode, eOpts) { return this.onBeforeInsert(store, node, refNode); },
        beforeappend: function(store, node, eOpts) { return this.onBeforeAppend(store, node); },
        insert: function(store, node, refNode, eOpts) { this.onInsertAndAppend(node); },
        append: function(store, node, index, eOpts) { this.onInsertAndAppend(node); },
        remove: function(store, node, isMove, eOpts) { this.onRemove(store, node, isMove); }
    },

    constructor: function(config) {
        config = Ext.apply({}, config);
        this.callParent([config]);
    },
        
    /**
    * Returns all layers as OpenEMap layer configuration tree.
    * @return {Object} layerConfig  OpenEMap layer configuration
    */
    getLayerConfiguration: function(includeLayerRef) {
        var layerConfig = [];

        function configAddLayer(node, includeLayerRef) {
            var layerCfg = {
                name: node.get('name'),
                isGroupLayer: node.get('isGroupLayer'),
                expanded: node.get('expanded'),
                queryable: node.get('queryable'),
                clickable: node.get('clickable'),
                wms: typeof node.get('wms') === 'string' ? {} : node.get('wms'),
                wfs: typeof node.get('wfs') === 'string' ? {} : node.get('wfs'),
                layer: includeLayerRef ? node.get('layer') : undefined,
                metadata: typeof node.get('metadata') === 'string' ? {} : node.get('metadata'),
                layers: []
            };
            
            if (!layerCfg.wms || Object.keys(layerCfg.wms).length === 0) layerCfg.wms = undefined;
            if (!layerCfg.wfs || Object.keys(layerCfg.wfs).length === 0) layerCfg.wfs = undefined;
//            if (!layerCfg.layers || layerCfg.layers.length === 0) layerCfg.layers = undefined;

	        for(var j=0; j<node.childNodes.length;j++) {
		        layerCfg.layers.push(configAddLayer(node.childNodes[j], includeLayerRef));
	        }
			return layerCfg;
        }

        var childNodes = this.getRootNode().childNodes;
        for (var i=0; i<childNodes.length;i++) {
	        layerConfig.push(configAddLayer(childNodes[i], includeLayerRef));
/*
            var parseLayer = function(layer) {
                return {
                    name: layer.name,
                    isGroupLayer: layer.isGroupLayer,
                    queryable: layer.queryable,
                    clickable: layer.clickable,
                    wms: typeof layer.wms === 'string' ? {} : layer.wms,
                    wfs: typeof layer.wfs === 'string' ? {} : layer.wfs,
                    layer: includeLayerRef ? layer.layer : undefined,
                    layers: layer.layers ? layer.layers.map(parseLayer) : undefined,
                    metadata: typeof layer.metadata === 'string' ? {} : layer.metadata
                };
            };
            
        	var node = this.getRootNode();
            node.childNodes.forEach(function(subnode) {
                layerConfig[i].layers.push({
                    name: subnode.get('name'),
                    isGroupLayer: subnode.get('isGroupLayer'),
                    queryable: subnode.get('queryable'),
                    clickable: subnode.get('clickable'),
                    wms: typeof subnode.get('wms') === 'string' ? {} : subnode.get('wms'),
                    wfs: typeof subnode.get('wfs') === 'string' ? {} : subnode.get('wfs'),
                    layer: includeLayerRef ? subnode.get('layer') : undefined,
                    layers: subnode.get('layers') instanceof Array ? subnode.get('layers').map(parseLayer) : undefined,
                    metadata: typeof subnode.get('metadata') === 'string' ? {} : subnode.get('metadata')
                });
            });
*/        }
       return layerConfig;
    },

    /**
    * Before append to store
    * @param {Ext.data.Model} node
    * @param {Ext.data.Model} appendNode
    */
    onBeforeAppend: function(node, appendNode) {
        return true;
    },
    
    createInlineLegend: function(node) {
        if (!node.raw.layer || node.get('hasInlineLegend')) {
            return;
        }
        var layer = node.raw.layer;
        var url;
        if (layer.legendURL !== undefined) {
            url = layer.legendURL;
        } else if (node.raw.wms && node.raw.wms.params && (node.raw.wms.params.LAYERS || node.raw.wms.params.layers)) {
            var layerRecord = GeoExt.data.LayerModel.createFromLayer(layer);
            var legend = Ext.create('GeoExt.container.WmsLegend', {
                layerRecord: layerRecord
            });
            url = legend.getLegendUrl(node.raw.wms.params.LAYERS || node.raw.wms.params.layers);
        }
        if (url && url.length > 0) {
            node.set('text', '<div style="display:inline-block;width:20px;height:20px;margin-right:2px;overflow:hidden;"><img class="legendimg" src="' + url + '" style="height:20px;"></div>' + node.get('text')); 
        }
        node.set('hasInlineLegend', true);
    },

    /**
    * Before insert to store
    * @param {Ext.data.Store} store
    * @param {Ext.data.Model} node
    * @param {Ext.data.Model} refNode
    */
    onBeforeInsert: function(store, node, refNode) {
        return true;
    },

    /**
     * Handler for a store's insert and append event.
     *
     * @param {Ext.data.Model} node
     */
    onInsertAndAppend: function(node) {
        if(!this._inserting) {
            this._inserting = true;
            
            var isFromAdd = node.getOwnerTree() instanceof OpenEMap.view.layer.Add;
           
            if (!isFromAdd) {
                // use from add internal checked status
                if (node.raw.checked_) {
                    node.set('checked', node.raw.checked_);
                }
            
                // Add this node layers and subnodes to map.
                node.cascadeBy(function(subnode) {
                    var layer = subnode.get('layer');

                    // Add getLayer function to support GeoExt
                    subnode.getLayer = function() {
                        return this.get('layer');
                    };

                    if(layer && layer !== '' && this.map) {
                        var mapLayer = this.map.getLayer(layer);
                        if(mapLayer === null && layer && layer.displayInLayerSwitcher === true) {
                            this.map.addLayer(layer);
                        }
                    }
                }, this);
            
                this.reorderLayersOnMap();
                
                this.createInlineLegend(node);
            }
            
            delete this._inserting;
        }
    },

    /**
     * Handler for a store's remove event.
     *
     * @param {Ext.data.Store} store
     * @param {Ext.data.Model} node
     * @param {Boolean} isMove
     * @private
     */
    onRemove: function(store, node, isMove) {
        if(!this._removing && !isMove) {
            this._removing = true;
            // Remove layer and sublayers from map
            node.cascadeBy(function(subnode) {
                var layer = subnode.get('layer');
                if(layer && layer.map) {
                    this.map.removeLayer(layer);
                }
            }, this);

            delete this._removing;
        }
    },

    /**
     * Reorder map layers from store order
     *
     * @private
     */
    reorderLayersOnMap: function() {
        var node = this.getRootNode();
        if(node) {
            var i = this.maxLayerIndex;
            node.cascadeBy(function(subnode) {
                var layer = subnode.get('layer');
                
                if(layer) {
                    layer.setZIndex(i);
                    i--;
                }
               
            }, this);
        }
    },
    /**
     * Unbind this store from the map it is currently bound.
     */
    unbind: function() {
        var me = this;
        me.un('beforeinsert', me.onBeforeInsert, me);
        me.un('beforeappend', me.onBeforeAppend, me);
        me.un('insert', me.onInsertAndAppend, me);
        me.un('append', me.onInsertAndAppend, me);
        me.un('remove', me.onRemove, me);
        me.map = null;
    },

    /**
     * Unbinds listeners by calling #unbind prior to being destroyed.
     *
     * @private
     */
    destroy: function() {
        //this.unbind();
        //this.callParent();
    }
});
