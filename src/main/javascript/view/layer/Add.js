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
        
        this.columns = [
            {
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'text'
            },
            me.metadataColumn
        ];

        this.store = Ext.create('OpenEMap.data.GroupedLayerTree');
        
        Ext.Ajax.request({
            url: OpenEMap.basePathProxy + OpenEMap.wmsURLs.getCapabilities,
            success: this.parseCapabilities,
            scope: this,
            disableCaching: false
        });

        this.callParent(arguments);      
    },
    
    parseCapabilities: function(response) {
        var format = new OpenLayers.Format.WMSCapabilities();
        var wms = format.read(response.responseText);
        
        var root = this.store.setRootNode({});
        
        var stripName = function(name) {
            var parts = name.split(':');
            return parts.length > 1 ? parts[1] : name;
        };
        
        wms.capability.layers.sort(function(a, b) {
            if (stripName(a.name) < stripName(b.name)) {
                return -1;
            }
            if (stripName(a.name) > stripName(b.name)) {
                return 1;
            }
            return 0;
        });
        
        var children = wms.capability.layers.map(function(layer) {
            var layerConfig = {
                'text': stripName(layer.name),
                'leaf': true,
                'checked_': true, // internal checked status
                'title': layer.title,
                'name': layer.title,
                'queryable': layer.queryable,
                'clickable': layer.queryable,
                'isGroupLayer': false,
                'visibility': true,
                'metadataURL': layer.metadataURLs.length > 0 ? layer.metadataURLs[0] : null,
                'wms':{
                    'url': OpenEMap.wmsURLs.url,
                    'params': {
                        'LAYERS': layer.name,
                        'FORMAT': 'image/png',
                        'TRANSPARENT': true
                    },
                    'options': {
                        'isBaseLayer': false,
                        'visibility': true
                    }
                }
            };
            
            var parser = Ext.create('OpenEMap.config.Parser');
            layerConfig.layer = parser.createLayer(layerConfig);

            return layerConfig;
        });
        
        root.appendChild(children);
    }

});
