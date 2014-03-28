Ext.define('OpenEMap.view.layer.TreeFilter', {
    extend: 'Ext.AbstractPlugin', 
    alias: 'plugin.treefilter', 
    
    collapseOnClear: true, 
    allowParentFolders: false, 

    init: function (tree) {
        var me = this;
        me.tree = tree;

        tree.filter = Ext.Function.bind(me.filter, me);
        tree.clearFilter = Ext.Function.bind(me.clearFilter, me);
    },

    filter: function (value, property, re) {
            var me = this, 
                tree = me.tree,
                matches = [],
                root = tree.getRootNode(),
                // property is optional - will be set to the 'text' propert of the  treeStore record by default
                property = property || 'text',
                // the regExp could be modified to allow for case-sensitive, starts  with, etc.
                re = re || new RegExp(value, "ig"),
                visibleNodes = [],
                viewNode;

            // if the search field is empty
            if (Ext.isEmpty(value)) {                                           
                me.clearFilter();
                return;
            }

            // expand all nodes for the the following iterative routines
            tree.expandAll();

            // iterate over all nodes in the tree in order to evalute them against the search criteria
            root.cascadeBy(function (node) {
                // if the node matches the search criteria and is a leaf (could be  modified to searh non-leaf nodes)
                if (node.get(property).match(re)) {
                    // add the node to the matches array
                    matches.push(node);
                }
            });

            // if me.allowParentFolders is false (default) then remove any  non-leaf nodes from the regex match
            if (me.allowParentFolders === false) {
                Ext.each(matches, function (match) {
                    if (!match.isLeaf()) {
                        Ext.Array.remove(matches, match);
                    }
                });
            }

            // loop through all matching leaf nodes
            Ext.each(matches, function (item, i, arr) {
                // find each parent node containing the node from the matches array
                root.cascadeBy(function (node) {
                    if (node.contains(item) == true) {
                        // if it's an ancestor of the evaluated node add it to the visibleNodes  array
                        visibleNodes.push(node);
                    }
                });
                // if me.allowParentFolders is true and the item is  a non-leaf item
                if (me.allowParentFolders === true && !item.isLeaf()) {
                    // iterate over its children and set them as visible
                    item.cascadeBy(function (node) {
                        visibleNodes.push(node);
                    });
                }
                // also add the evaluated node itself to the visibleNodes array
                visibleNodes.push(item);
            });

            // finally loop to hide/show each node
            root.cascadeBy(function (node) {
                // get the dom element assocaited with each node
                viewNode = Ext.fly(tree.getView().getNode(node));
                // the first one is undefined ? escape it with a conditional
                if (viewNode) {
                    viewNode.setVisibilityMode(Ext.Element.DISPLAY);
                    // set the visibility mode of the dom node to display (vs offsets)
                    viewNode.setVisible(Ext.Array.contains(visibleNodes, node));
                }
            });
        }, 

        clearFilter: function () {
            var me = this
                , tree = this.tree
                , root = tree.getRootNode();

            if (me.collapseOnClear) {
                // collapse the tree nodes
                tree.collapseAll();
            }
            // final loop to hide/show each node
            root.cascadeBy(function (node) {
                // get the dom element assocaited with each node
                viewNode = Ext.fly(tree.getView().getNode(node));
                // the first one is undefined ? escape it with a conditional and show  all nodes
                if (viewNode) {
                    viewNode.show();
                }
            });
        }
    });
