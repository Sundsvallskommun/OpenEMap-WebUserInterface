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
                    layers: this.mapPanel.map.layerSwitcherLayerTree
                },
                map: this.mapPanel.map
            });
        }

        this.on('checkchange', function(node, checked, eOpts) {
            var parent = node.parentNode;
        
            if(checked) {
                // Loop this node and children
                node.cascadeBy(function(n){
                    n.set('checked', checked);
                    var olLayerRef = n.get('layer');
                    // Change layer visibility (Layer groups have no layer reference)
                    if(olLayerRef) {
                        olLayerRef.setVisibility(true);
                    }
                });
                // check parent if not root
                if (!parent.isRoot()) {
                    parent.set('checked', checked);
                }
            } else {
                node.cascadeBy(function(n){
                    // Loop this node and children
                    n.set('checked', false);
                    var olLayerRef = n.get('layer');
                    if(olLayerRef) {
                        olLayerRef.setVisibility(false);
                    }
                });
                // uncheck parent if not root and its children are unchecked
                if (!parent.isRoot() && !parent.childNodes.some(function(node) { return node.get('checked'); })) {
                    parent.set('checked', checked);
                }
            }
        });

        this.on('cellclick', function(tree, td, cellIndex, node) {
            // Add legend if node have a wms legend and the node isnt removed
            if((node.gx_wmslegend || node.gx_urllegend) && node.store) {
                var legend = node.gx_wmslegend || node.gx_urllegend;
                if (legend.isHidden()) {
                    if (!legend.rendered) {
                        legend.render(td);
                    }
                    legend.show();
                } else {
                    legend.hide();
                }
            }
        });
        
        this.callParent(arguments);
    }

});
