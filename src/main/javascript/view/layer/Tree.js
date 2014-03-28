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
            } else {
                node.cascadeBy(function(n){
                    // Loop this node and children
                    n.set('checked', false);
                    var olLayerRef = n.get('layer');
                    if(olLayerRef) {
                        olLayerRef.setVisibility(false);
                    }
                });
            }
        });

        this.on('cellclick', function(tree, td, cellIndex, node) {
            // Add legend if node have a wms legend and the node isnt removed
            if(node.gx_wmslegend && node.store) {
                var legend = node.gx_wmslegend;
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