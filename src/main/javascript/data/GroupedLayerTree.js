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
    getLayerConfiguration: function() {
        var layerConfig = [];
        this.getRootNode().childNodes.forEach(function(node, i) {
            layerConfig[i] = {
                name: node.get('name'),
                layers: []
            };
            
            node.childNodes.forEach(function(subnode) {
                layerConfig[i].layers.push({
                    name: subnode.get('name'),
                    wms: typeof subnode.get('wms') === 'string' ? {} : subnode.get('wms'),
                    wfs: typeof subnode.get('wfs') === 'string' ? {} : subnode.get('wfs'),
                    metadata: typeof subnode.get('metadata') === 'string' ? {} : subnode.get('metadata')
                });
            });
        });
        return layerConfig;
    },

    /**
    * Before append to store
    * @param {Ext.data.Model} node
    * @param {Ext.data.Model} appendNode
    */
    onBeforeAppend: function(node, appendNode) {
        // Prevent groups from being added to groups
        if ((node && !node.isRoot()) && !appendNode.isLeaf()) {
            return false;
        }
        return true;
    },

    /**
    * Before insert to store
    * @param {Ext.data.Store} store
    * @param {Ext.data.Model} node
    * @param {Ext.data.Model} refNode
    */
    onBeforeInsert: function(store, node, refNode) {
        // Prevent groups from being added to groups
        if(!refNode.parentNode.isRoot() && !node.isLeaf()) {
            return false;
        }
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
            
            // Add this node layers and subnodes to map.
            node.cascadeBy(function(subnode) {
                var layer = subnode.get('layer');

                // Add getLayer function to support GeoExt
                subnode.getLayer = function() {
                    return this.get('layer');
                };
                // Add WMS legened 
                this.addWMSLegend(subnode);

                if(layer && layer !== '' && this.map) {
                    var mapLayer = this.map.getLayer(layer);
                    if(mapLayer === null && layer && layer.displayInLayerSwitcher === true) {
                        this.map.addLayer(layer);
                    }
                }
            }, this);

            this.reorderLayersOnMap();
            
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
    * Adds a WMS-legend to a node
    * @param {Ext.data.Model} node
    * @return {Ext.data.Model} node
    */
    addWMSLegend: function(node) {
        var layer = node.get('layer');
    
        if (layer) {
            if (Ext.isIE9) return node;
            if (layer.legendURL) {
                node.set('legendURL', layer.legendURL);
                node.gx_urllegend = Ext.create('GeoExt.container.UrlLegend', {
                    layerRecord: node,
                    showTitle: false,
                    hidden: true,
                    deferRender: true,
                    // custom class for css positioning
                    // see tree-legend.html
                    cls: "legend"
                });
            } else if (layer.CLASS_NAME == "OpenLayers.Layer.WMS") {
                node.gx_wmslegend = Ext.create('GeoExt.container.WmsLegend', {
                    layerRecord: node,
                    showTitle: false,
                    hidden: true,
                    deferRender: true,
                    // custom class for css positioning
                    // see tree-legend.html
                    cls: "legend"
                });
            }
        }
        return node;
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
