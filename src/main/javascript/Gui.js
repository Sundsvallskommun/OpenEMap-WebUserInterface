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
 * Initializes GUI from configuration
 * Initialize where to place the different GUI components, and if they should be floating components or not 
 */
Ext.define('OpenEMap.Gui', {
    activeAction: null,
    requires: ['OpenEMap.action.DeleteAllFeatures',
               'OpenEMap.action.DeleteGeometry',
               'OpenEMap.action.DeleteMeasure',
               'OpenEMap.action.DetailReport',
               'OpenEMap.action.DrawGeometry',
               'OpenEMap.action.DrawObject',
               'OpenEMap.action.FullExtent',
               'OpenEMap.action.Identify',
               'OpenEMap.action.MeasureArea',
               'OpenEMap.action.MeasureLine',
               'OpenEMap.action.MetadataInfoColumn',
               'OpenEMap.action.ModifyGeometry',
               'OpenEMap.action.ModifyText',
               'OpenEMap.action.Permalink',
               'OpenEMap.action.Popup',
               'OpenEMap.action.Print',
               'OpenEMap.action.SelectGeometry',
               'OpenEMap.view.BaseLayers',
               'OpenEMap.view.DetailReportResults',
               'OpenEMap.view.IdentifyResults',
               'OpenEMap.view.Map',
               'OpenEMap.view.ObjectConfig',
               'OpenEMap.view.SearchCoordinate',
               'OpenEMap.view.SearchFastighet',
               'OpenEMap.view.Scalebar',
               'OpenEMap.view.ShowCoordinate',
               'OpenEMap.view.ZoomTools',
               'OpenEMap.view.layer.Advanced',
               'OpenEMap.view.layer.Basic',
               'GeoExt.container.WmsLegend',
               'GeoExt.container.UrlLegend',
               'GeoExt.container.VectorLegend'],
    objectConfigWindowTitle: 'Object configuration',
    constructor : function(config) {
        this.config = config.config;
        this.gui = config.gui;
        this.map = config.map;
        this.orginalConfig = config.orginalConfig;
        this.serverStore = config.serverStore;
        this.search = config.config.search;
        this.client = config.client;

        // GUI defaults
        if (this.gui === undefined) {
            this.gui = {};
        }
        if (this.gui.map === undefined) {this.gui.map = false;}
        if (this.gui.map === {}) {this.gui.map = false;}
        if (this.gui.layerControl === undefined) {this.gui.layerControl = {};}
        if (this.gui.addLayerControl === undefined) {this.gui.addLayerControl = {};}
//        if (this.gui.rightPanel === undefined) {this.gui.rightPanel = {};}
        
        this.mapPanel = Ext.create('OpenEMap.view.Map', {
            map: this.map,
            extent: this.config.extent,
            config: this.config,
            listeners: {
                'afterrender': function() {
                    if (this.config.attribution) {
                        var el = this.mapPanel.getEl();
                        Ext.DomHelper.append(el, '<span class="unselectable attribution">'+this.config.attribution+'</span>');
                    }
                },
                scope: this
            }
        });
                
        this.createToolbar();
        this.createZoomToolPanel();
        this.createObjectConfigPanel();
        this.createScalebarPanel();
        this.createShowCoordinatePanel();
        this.createSearchCoordinatePanel();
        this.createLayerControl();
        this.createBaseLayersPanel();
        
        var items = [];
        items.push(this.mapPanel);
        if (this.zoomTools && !this.gui.zoomTools.renderTo) items.push(this.zoomTools);
        if (this.objectConfig && !this.gui.objectConfig.renderTo) items.push(this.objectConfig);
        if (this.scalebar && !this.gui.scalebar.renderTo) items.push(this.scalebar);
        if (this.showCoordinate && !this.gui.showCoordinate.renderTo) items.push(this.showCoordinate);
        if (this.searchCoordinate && !this.gui.searchCoordinate.renderTo) items.push(this.searchCoordinate);
        if (this.layerControl && !this.gui.layerControl.renderTo) items.push(this.layerControl);
        if (this.addLayerControl && !this.gui.addLayerControl.renderTo) items.push(this.addLayerControl);
//        if (this.rightPanel && !this.gui.rightPanel.renderTo) items.push(this.rightPanel);
        if (this.baseLayers && !this.gui.baseLayers.renderTo) items.push(this.baseLayers);
        if (this.toolbar && !this.gui.toolbar.renderTo) items.push(this.toolbar);
        
        // NOTE: Generic ES search as a floating centered field
        /*this.search = Ext.create('OpenEMap.form.Search', {
            mapPanel : this.mapPanel,
            width: 300,
            style: {
                right: '20px',
                bottom: '76px'
            }
        });
        items.push(this.search);*/
        
        // create map rendered to a target element or as viewport depending on config
        if (this.gui.map) {
            var element = this.gui.map.renderTo ? Ext.get(this.gui.map.renderTo) : undefined;
            this.container = Ext.create('Ext.container.Container', Ext.apply({
                layout : 'absolute',
                border: false,
                width: element ? element.getWidth() : undefined,
                height: element ? element.getHeight() : undefined,
                items : items
            }, this.gui.map));
//            window.addEventListener('resize', function() {
//            	element.setWidth(window.innerWidth);
//            	element.setHeight(window.innerHeight);
//            	this.mapClient.mapPanel.setSize(window.innerWidth, window.innerHeight);
//            	element.setSize(window.innerWidth, window.innerHeight);
//           });
        } else {
            this.container = Ext.create('Ext.container.Viewport', {
                layout : 'absolute',
                items : items
            });
        }
    },
    destroy: function() {
        if (this.mapPanel) this.mapPanel.destroy();
        if (this.zoomTools) this.zoomTools.destroy();
        if (this.mapLayers) this.mapLayers.destroy();
        if (this.searchFastighet) this.searchFastighet.destroy();
        if (this.searchCoordinate) this.searchCoordinate.destroy();
        if (this.showCoordinate) this.showCoordinate.destroy();
        if (this.toolbar) this.toolbar.destroy();
        if (this.layerControl) this.layerControl.destroy();
        if (this.addLayerControl) this.addLayerControl.destroy();
//        if (this.rightPanel) this.rightPanel.destroy();
        if (this.baseLayers) this.baseLayers.destroy();
        if (this.objectConfig) this.objectConfig.destroy();
        if (this.objectConfigWindow) this.objectConfigWindow.destroy();
        if (this.scalebar) this.scalebar.destroy();
        if (this.container) this.container.destroy();
        //if (this.search) this.search.destroy();
    },
    onToggle: function(button, pressed) {
        var action = button.baseAction;
        
        if (!this.objectConfig) return;
        
        // NOTE: want the effect of unselecting all and hiding object dialog on detoggle, but that is triggered after toggle... so this will have to do
        if (pressed) {
            this.mapPanel.unselectAll();
            this.objectConfig.hide();
            this.activeAction = action;
        }
        
        action.toggle(pressed);
    },
	/**
	 * Create toolbar
     * @private
	 */
    createToolbar: function() {
        var basePath = this.config.basePath;
        var layers = this.config.layers;
        
        var createAction = function(type) {
            var cls;
            if((Ext.isObject(type) && Ext.Object.getSize(type) > 0) || (!Ext.isObject(type) && !Ext.isEmpty(type))) {
                if (type === this.config.tools[this.config.tools.length-1]) cls = 'oep-tools-last';
                
                var config = {
                    map: this.map,
                    mapPanel: this.mapPanel,
                    cls: cls
                };
                
                if (type.constructor === Object) {
                    Ext.apply(config, type);
                    type = config.type;
                    delete config.type;
                }

                if (type == 'ZoomSelector') {
                    return Ext.create('OpenEMap.form.ZoomSelector', {
                        map: this.map,
                        cls: cls
                    });
                } else if (type == 'DrawObject') {
                     config.objectConfigView = this.objectConfig;
                } else if (type == 'Identify') {
                    config.basePath = basePath;
                    config.layers = layers;
                    config.client = this.client;
                } else if (type == 'Permalink') {
                    config.client = this.client;
                } else if (type == 'Popup') {
                    config.layers = layers;
					if ((config.showOnlyFirstHit === undefined) || (config.showOnlyFirstHit === null)) {
						config.showOnlyFirstHit = true;
	                }
				}
				
                var action = Ext.create('OpenEMap.action.' + type, config);
                if (config.activate && action.control) {
                    this.controlToActivate = action.control;
                }
                var button = Ext.create('Ext.button.Button', action);
                button.on('toggle', this.onToggle, this);
                return button;
            }
        };
        
        if (!this.config.tools) {
            this.config.tools = [];
        }
        
        // TODO: need to apply cls: 'oep-tools-last' to last item...
        var tbar = this.config.tools.map(createAction, this);
        
        // calc width of toolbar
        var width = 0; // padding
        tbar.forEach(function(item) {
            if (item){
                if (!item.hideFromToolbar) {
	                if (item.constructor == String) {
	                    width += 1; // separator
	                } else if (item.width) {
	                    width += item.width + 1;
	                } else {
	                    width += 38; // button
	                }
	                // add spacing to next control
	                //width += 8;
                }
            }
        });
        //width += 3; // padding
                
        // create toolbar as floating left panel if no renderTo target is configured
        if (this.gui.toolbar && !this.gui.toolbar.renderTo) {
            this.toolbar = Ext.create('Ext.toolbar.Toolbar', Ext.apply({
                cls: 'oep-tools',
                y : 20,
                x : 20,
                width: width,
                items: tbar
            }, this.gui.toolbar));
        } else if (this.gui.toolbar && this.gui.toolbar.renderTo) {
            this.toolbar = Ext.create('Ext.toolbar.Toolbar', Ext.apply({
                cls: 'oep-tools',
                width : this.gui.toolbar.width || width,
                items: tbar
            }, this.gui.toolbar));
        }
    },
    /**
     * Create right panel including 
     * - Layers panel
     * - SearchParcel panel
     * @private
     */
    createLayerControl: function() {
        
        var layerControlItems = [];
        // default position for layerControl and addLayerControl
        if (!this.gui.layerControl.y) {this.gui.layerControl.y = 20;}
        if (!this.gui.layerControl.right) {this.gui.layerControl.right = 20;}
        if (!this.gui.layerControl.style) {this.gui.layerControl.style = 'right: ' + this.gui.layerControl.right + 'px';}
        if (!this.gui.layerControl.width) {this.gui.layerControl.width = 300;}
        if (!this.gui.layerControl.maxHeight) {this.gui.layerControl.maxHeight = window.innerHeight-this.gui.layerControl.y-60;}

        if (!this.gui.addLayerControl.y) {this.gui.addLayerControl.y = this.gui.layerControl.y;}
        if (!this.gui.addLayerControl.right) {this.gui.addLayerControl.right = this.gui.layerControl.width + this.gui.layerControl.right;}
        if (!this.gui.addLayerControl.style) {this.gui.addLayerControl.style = 'right: ' + this.gui.addLayerControl.right + 'px';}
        if (!this.gui.addLayerControl.width) {this.gui.addLayerControl.width = 300;}
        if (!this.gui.addLayerControl.maxHeight) {this.gui.addLayerControl.maxHeight = window.innerHeight-this.gui.addLayerControl.y-56;}
        
        if (this.gui.layers) {
	        // Checks whether the advanced or basic Layer control should be used
	        if (this.gui.layers && this.gui.layers.type === 'advanced') {
	            this.mapLayers = Ext.create('OpenEMap.view.layer.Advanced', Ext.apply({
	                mapPanel : this.mapPanel,
	                orginalConfig: this.orginalConfig,
	                client: this.client,
	                flex: 1
	            }, this.gui.layers));
	            
	            // Adds the Add layer control
				this.addLayerControl = Ext.create('OpenEMap.view.layer.Add', {
				    mapPanel: this.mapPanel,
				    border: false,
		        	renderTo: this.gui.addLayerControl.renderTo,
		        	y: this.gui.addLayerControl.y,
		            style : this.gui.addLayerControl.style,
				    width: this.gui.addLayerControl.width,
				    maxHeight: this.gui.addLayerControl.maxHeight,
				    collapsible: true,
				    dataHandler: this.dataHandler,
				    metadataColumn: Ext.create('OpenEMap.action.MetadataInfoColumn',{
			 			metadataWindow: this.metadataWindow,
			 			dataHandler: this.dataHandler
			 		})
				});

	        } else {
	            this.mapLayers = Ext.create('OpenEMap.view.layer.Basic', Ext.apply({
	                mapPanel : this.mapPanel,
	                client: this.client,
	                flex: 1
	            }, this.gui.layers));
	        }
	        
	        // If the layers panel not should be rendered to div, add it to the right panels items
	        if (!this.gui.layers.renderTo) {
	        	layerControlItems.push(this.mapLayers);
	        }
	    }
        
        
        if (this.gui.searchFastighet && this.search)  {
	        // Create SearchParcel control
	        this.searchFastighet = Ext.create('OpenEMap.view.SearchFastighet', Ext.apply({
	            mapPanel : this.mapPanel,
	            basePath: this.config.basePath,
	            search: this.search,
		        collapsible: true,
	            height: 120,
	            width: this.gui.layerControl.width
	        }, this.gui.searchFastighet));
            if (!this.gui.searchFastighet.renderTo) {
            	layerControlItems.push(this.searchFastighet);
            }
        }

        // create right panel containing layers and search panels if no renderTo target is configured
        if (layerControlItems.length > 0) {
            this.layerControl = Ext.create('Ext.panel.Panel', {
	        	renderTo: this.gui.layerControl.renderTo,
	            y : this.gui.layerControl.y,
                style : this.gui.layerControl.style,
                layout : {
                    type: 'vbox',
                    align : 'stretch'
                },
                width : this.gui.layerControl.width,
                maxHeight: this.gui.layerControl.maxHeight,
                border: false,
                bodyStyle: {
                    background: 'transparent'
                },
                items : layerControlItems
	        });
	    }
	    
/*	    if (this.addLayerControl) {
	        this.rightPanel = Ext.create('Ext.panel.Panel', {
	            title: 'Lager',
	            collapsible: true,
	        	renderTo: this.gui.rightPanel.renderTo,
	            y : this.gui.layerControl.y,
	            style : this.gui.layerControl.style,
	            layout : {
	                type: 'hbox'
	            },
	            width : this.gui.layerControl.width + this.gui.addLayerControl.width,
	            maxHeight: this.gui.layerControl.maxHeight,
	            border: false,
	            bodyStyle: {
	                background: 'transparent'
	            },
	            items : [
	            	this.addLayerControl, 
	            	this.layerControl
	            ]
	        });
       	}
*/

	},
        
	/** 
	 * Create base layers control
	 * @private
	 */ 
    createBaseLayersPanel: function() {
        // Create BaseLayers control
        if (!this.map.allOverlays && this.gui.baseLayers) {
            var layers = this.map.layers;
            var parser = Ext.create('OpenEMap.config.Parser');
            var baseLayers = parser.extractBaseLayers(layers);
	        // Only create if config has baselayers
        	if (baseLayers) {
        		if (!(this.gui.baseLayers.renderTo || this.gui.baseLayers.style)) {
    				this.gui.baseLayers.style = {
    					right: '20px',
    					bottom: '20px'
    				};
        		}
	            this.baseLayers = Ext.create("OpenEMap.view.BaseLayers", Ext.apply({
	                mapPanel : this.mapPanel,
	                renderTo : this.gui.baseLayers.renderTo
	            }, this.gui.baseLayers));
	        }
        }
	},

	/**
	 * Create ZoomTool panel
	 * @private 
	 */	
    createZoomToolPanel: function() {
        // Create ZoomTool control
        if (this.gui.zoomTools) {
    		if (!(this.gui.zoomTools.renderTo || this.gui.zoomTools.style)) {
				this.gui.zoomTools.style = {
					left: '20px',
					top: '76px'
				};
    		}
            this.zoomTools = Ext.create('OpenEMap.view.ZoomTools', Ext.apply({
                mapPanel : this.mapPanel,
                renderTo : this.gui.zoomTools.renderTo,
                width: 36
            }, this.gui.zoomTools));
        }
    },

	/**
	 * Create search coodinates panel
	 * @private 
	 */	
    createSearchCoordinatePanel: function() {
        // Create SearchCoordinate control                
        // only create if renderTo
        if (this.gui.searchCoordinate && this.gui.searchCoordinate.renderTo) {
            this.searchCoordinate = Ext.create('OpenEMap.view.SearchCoordinate', Ext.apply({
                mapPanel : this.mapPanel
            }, this.gui.searchCoordinate));
        }
    },

	/** 
	 * Create object config window
	 * always created inside map div 
	 * @private
	 */ 
    createObjectConfigPanel: function() {
        // Create Object config
        if (this.gui.objectConfig) {
            this.objectConfig = Ext.create('OpenEMap.view.ObjectConfig', Ext.apply({
                mapPanel : this.mapPanel,
                gui: this
            }, this.gui.objectConfig));
            this.objectConfigWindow = Ext.create('Ext.window.Window', Ext.apply({
                title: this.objectConfigWindowTitle,
                width: 480,
                height: 300,
                layout: 'fit',
                closable: false,
                collapsible: true,
                items: this.objectConfig
            }, this.gui.objectConfig));
            this.objectConfigWindow.show();
        }
	},

	/**
	 * Create show coordinate panel
	 * @private 
	 */	
    createShowCoordinatePanel: function() {
        // Create Show Coordinate control 
        // only create if renderTo 
        if (this.gui.showCoordinate && this.gui.showCoordinate.renderTo) {
        	if (!this.cls) {
        		this.cls = 'oep-show-coordinate';
        	} 
        	var cfg = {
                mapPanel : this.mapPanel,
                cls : this.cls,
			    setCoord: function(e) {
			    	var lonlat = this.getLonLatFromPixel(e.xy);
			    	var eC = OpenEMap.mapClient.gui.showCoordinate.getComponent('e');
			    	var nC = OpenEMap.mapClient.gui.showCoordinate.getComponent('n');
			    	eC.setValue(Math.round(lonlat.lon));
			    	nC.setValue(Math.round(lonlat.lat));
			    }
        	};
            this.showCoordinate = Ext.create('OpenEMap.view.ShowCoordinate', Ext.apply(cfg, this.gui.showCoordinate));
		    this.map.events.register("mousemove", this.map, this.showCoordinate.setCoord);
        }
	},

	/**
	 * Create scalebar panel
	 * @private 
	 */	
    createScalebarPanel: function() {
        // Create scalebar control
       	// Position defined in CSS - defaults to lower left corner of map
        if (this.gui.scalebar) {
            this.scalebar = Ext.create('OpenEMap.view.Scalebar', Ext.apply({
                mapPanel : this.mapPanel
            }, this.gui.scalebar));
        }
    }
});
