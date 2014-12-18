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

Ext.define('OpenEMap.view.layer.Advanced' ,{
	extend: 'Ext.container.Container',

	requires: [
		'OpenEMap.action.MetadataInfoColumn',
		'OpenEMap.view.layer.Add',
		'OpenEMap.view.layer.Tree',
		'OpenEMap.view.MetadataWindow',
		'OpenEMap.view.SavedMapConfigs',
		'OpenEMap.data.DataHandler',
		'Ext.tree.plugin.TreeViewDragDrop',
		'Ext.util.Point' // For some reason needed to use drag drop
	],

	layout: {
		type: 'hbox',
	    pack: 'end',
	    align: 'stretch'
	},
	width: 500,
	height: 650,

 	initComponent: function(config) {
 		var me = this;

 		this.dataHandler = Ext.create('OpenEMap.data.DataHandler');

 		this.metadataWindow = Ext.create('OpenEMap.view.MetadataWindow', {
 			dataHandler: this.dataHandler
 		});

 		this.savedMapConfigs = Ext.create('OpenEMap.view.SavedMapConfigs', {
 			dataHandler: this.dataHandler,
 			client: this.client
 		});
 		
 		var renameAction = Ext.create('Ext.Action', {
            //iconCls: 'action-load',
            text: 'Byt namn...',
            disabled: true,
            handler: function(widget, event) {
                var node = this.showOnMapLayerView.getSelectionModel().getSelection()[0];
                if (node) {
                    Ext.Msg.prompt('Byt namn...', 'Ange nytt namn:', function(btn, text) {
                        if (btn == 'ok'){
                            node.set('text', text);
                        }
                    });
                }
            }.bind(this)
        });
 		
 		var createGroupAction = Ext.create('Ext.Action', {
            //iconCls: 'action-load',
            text: 'Nytt grupplager',
            disabled: true,
            handler: function(widget, event) {
                var node = this.showOnMapLayerView.getSelectionModel().getSelection()[0];
                if (node) {
                    Ext.Msg.prompt('Nytt grupplager', 'Ange namn:', function(btn, text) {
                        if (btn == 'ok'){
                            var group = Ext.create('OpenEMap.model.GroupedLayerTreeModel', {
                                text: text,
                                checked: true,
                                isGroupLayer: true
                            });
                            node.appendChild(group);
                        }
                    });
                }
            }.bind(this)
        });
 		
 		var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [
                renameAction,
                createGroupAction
            ]
        });

		this.showOnMapLayerView = Ext.create('OpenEMap.view.layer.Tree', {
			title: 'Visas på kartan',
			width: 250,
			height: 500,
			region: 'north',
    		mapPanel: this.mapPanel,
    		client: this.client,
    		rootVisible: true,
    		
    		viewConfig: {
		        plugins: {
	                ptype: 'treeviewdragdrop',
	                allowContainerDrops: true,
	                allowParentInserts: true
	            },
	            listeners: {
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        contextMenu.showAt(e.getXY());
                        return false;
                    }
                }
		    },

    		columns: [
	            {
	                xtype: 'gx_treecolumn',
	                flex: 1,
	                dataIndex: 'text'
	            }, 
	            Ext.create('OpenEMap.action.MetadataInfoColumn', {
		 			metadataWindow: this.metadataWindow,
		 			dataHandler: this.dataHandler
		 		}),
	            {
	                xtype: 'actioncolumn',
	                width: 40,
	                iconCls: 'action-remove',
	                tooltip: 'Ta bort',
	                handler: function(grid, rowIndex, colIndex) {
	                	var node = grid.getStore().getAt(rowIndex);
	                	// Remove childs
	                	for (var i = 0; i < node.childNodes.length; i++) {
	                		node.removeChild(node.childNodes[i]);
	                	}
					    node.remove();
					},
					dataHandler: this.dataHandler
	            }
	        ],
	        buttons: [
	        	{
		            text: 'Spara kartinnehåll',
		            handler: function() {
		            	if(me.orginalConfig) {
		            		var conf = Ext.clone(me.orginalConfig);
		            		Ext.MessageBox.prompt(
		            			'Namn', 
		            			'Ange ett namn:', 
		            			function(btn, text) {
		            				if (btn == 'ok' && text.length > 0) {
		            				    conf = me.getConfig();
						            	if(text !== conf.name) {
						            		// Save new config
						            		conf.name = text;
						            		me.dataHandler.saveNewConfiguration(conf, function() {
						            			me.savedMapConfigs.getStore().load();
						            		});
						            	} else if(conf.configId){
						            		// Update config
						            		me.dataHandler.updateConfiguration(conf.configId, conf);
						            	}
						            }
		            			},
		            			this,
		            			false,
		            			conf.name
		            		);
			            	
		            	}
		            }
		        }
		    ]
    	});
    	
    	this.showOnMapLayerView.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length === 1 && selections[0].data.isGroupLayer) {
                    renameAction.enable();
                    if (selections[0].internalId === 'root') {
                        createGroupAction.enable();
                    } else {
                        createGroupAction.disable();
                    }
                } else {
                    renameAction.disable();
                    createGroupAction.disable();
                }
            }
        });

	  	this.items = [
			Ext.create('OpenEMap.view.layer.Add', {
			    mapPanel: this.mapPanel,
			    dataHandler: this.dataHandler,
			    metadataColumn: Ext.create('OpenEMap.action.MetadataInfoColumn',{
		 			metadataWindow: this.metadataWindow,
		 			dataHandler: this.dataHandler
		 		})
			}),
	    	{
	    		xtype: 'panel',
	    		layout: 'border',
	    		width: '50%',
	    		border: false,
	    		items: [
	    			me.showOnMapLayerView,
			    	{
						title: 'Sparade kartor',
						region: 'center',
						xtype: 'panel',
						border: false,
						layout: 'fit',
						collapsible: true,
						titleCollapse: true,
						items: me.savedMapConfigs
					}
	    		]
	    	}
		];
    	this.callParent(arguments);
    },
    getConfig: function(includeLayerRef) {
        return this.showOnMapLayerView.getConfig(includeLayerRef);
    }
});
