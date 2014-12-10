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
 * Add layer view
 * View includes a drag/drop and collapsable layer tree
 */

Ext.define('OpenEMap.view.layer.Add' ,{
    extend: 'OpenEMap.view.layer.Tree',
    
    requires: [
        'OpenEMap.data.DataHandler',
        'OpenEMap.view.layer.TreeFilter',
        'OpenEMap.action.MetadataInfoColumn'
    ],

    title: 'Lägg till lager',

    width: 250,
    height: 550,

    headerPosition: 'top',
    collapsible: true,
    collapseMode: 'header',
    collapseDirection : 'right',
    titleCollapse: true,

    viewConfig: {
         plugins: {
            ptype: 'treeviewdragdrop',
            enableDrop: false
        },
        copy: true
    },

    // Layer tree filtering
    plugins: {
        ptype: 'treefilter',
        allowParentFolders: true
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            layout: 'fit',
            items: [{
                xtype: 'trigger',
                triggerCls: 'x-form-clear-trigger',
                onTriggerClick: function () {
                    this.reset();
                    this.focus();
                },
                listeners: {
                    change: function (field, newVal) {
                        var tree = field.up('treepanel');
                        tree.filter(newVal);
                    },
                    buffer: 250
                }
            }]
        }
    ],

    initComponent: function() {
        var me = this;
        this.on('checkchange', function(node, checked, eOpts) {
            node.cascadeBy(function(n){
                if(checked) {
                    me.loadLayer(n);
                } else {
                    me.unLoadLayer(n);
                }
            });
        });

        // Add columns
        this.columns = [
            {
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'text'
            },
            me.metadataColumn
        ];

        // Create store for the layer tree
        this.store = Ext.create('OpenEMap.data.GroupedLayerTree');
        
        Ext.Ajax.request({
            url: OpenEMap.wmsURLs.basePath + '?service=WMS&request=GetCapabilities',
            success: function(response) {
                var format = new OpenLayers.Format.WMSCapabilities();
                var wms = format.read(response.responseText);
                
                var root = this.store.setRootNode({
                });
                
                //console.log(wms);
                
                wms.capability.layers.forEach(function(layer) {
                    root.appendChild({
                        'text': layer.name,
                        'isGroupLayer': false,
                        'isSearchable': true,
                        'wms':{
                            'url': OpenEMap.wmsURLs.url,
                            'params': {
                                'layers': layer.name,
                                'format': 'image/png'
                            }
                        }
                    });
                }, this);
            },
            scope: this
        });

        // Create server store
        /*this.serverStore = Ext.create('OpenEMap.data.Servers',{ 
            proxy: {
                url: OpenEMap.wsUrls.basePath + OpenEMap.wsUrls.servers,
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'configs'
                }
            }
        });*/

        // Wait for server load to initiate layer tree
        /*this.serverStore.load({
            callback: function() {
                me.dataHandler.getLayers(function(layers) {
                    if(layers) {
                        var parser = new OpenEMap.config.Parser({
                            serverStore: me.serverStore 
                        });
                        var layerTree = parser.parseLayerTree(layers);

                        me.store.setRootNode({
                            text: 'Lager',
                            expanded: true,
                            layers: layerTree
                        });
                    }
                    
                });
            }
        });*/

        this.callParent(arguments);

        
    },

    /** 
    * Load a layer to GeoExt.MapPanel
    * @param {Ext.data.NodeInterface}   node    tree node
    */
    loadLayer: function(node) {
        var layer = node.get('layer');
        if(layer && layer !== '' && this.mapPanel) {
            layer.setVisibility(true);
            layer.displayInLayerSwitcher = false;
            this.mapPanel.layers.add(layer);
        }
    },

    /** 
    * Unload a layer from GeoExt.MapPanel
    * @param {Ext.data.NodeInterface}   node    tree node
    */
    unLoadLayer: function(node) {
        var layer = node.get('layer');
        if(layer && layer !== '' && this.mapPanel) {
            this.mapPanel.layers.remove(layer);
        }
    }

});
