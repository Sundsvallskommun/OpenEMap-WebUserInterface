/**
 * Initializes GUI from configuration
 * Initialize where to place the different GUI components, and if they should be floating components or 
 */
Ext.define('OpenEMap.Gui', {
    activeAction: null,
    requires: ['OpenEMap.action.*',
               'OpenEMap.view.BaseLayers',
               'OpenEMap.view.DetailReportResults',
               'OpenEMap.view.IdentifyResults',
               'OpenEMap.view.Map',
               'OpenEMap.view.ObjectConfig',
               'OpenEMap.view.SearchCoordinate',
               'OpenEMap.view.SearchFastighet',
               'OpenEMap.view.ZoomTools',
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

        // GUI defaults
        if (this.gui === undefined) {
            this.gui = {
                "map": false,
                "toolbar": {},
                "zoomTools":  {},
                "baseLayers": {},
                "layers": {},
                "searchFastighet": {},
                "objectConfig": {},
                "searchCoordinate": false
            };
        }
        
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
                
        this.createPanels();
        this.createToolbar();
        
        var items = [];
        items.push(this.mapPanel);
        if (this.zoomTools) items.push(this.zoomTools);
        if (this.leftPanel) items.push(this.leftPanel);
        if (this.rightPanel) items.push(this.rightPanel);
        if (this.baseLayers) items.push(this.baseLayers);
        
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
        if (this.toolbar) this.toolbar.destroy();
        if (this.leftPanel) this.leftPanel.destroy();
        if (this.rightPanel) this.rightPanel.destroy();
        if (this.baseLayers) this.baseLayers.destroy();
        if (this.objectConfig) this.objectConfig.destroy();
        if (this.objectConfigWindow) this.objectConfigWindow.destroy();
        if (this.container) this.container.destroy();
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
                    return Ext.create('OpenEMap.form.ZoomSelector', {map: this.map});
                }
                else {
                    if (type == 'DrawObject') {
                        config.objectConfigView = this.objectConfig;
                    } else if (type == 'Identify') {
                        config.basePath = basePath;
                        config.layers = layers;
                    }
                    var action = Ext.create('OpenEMap.action.' + type, config);
                    if (config.activate && action.control) {
                        this.controlToActivate = action.control;
                    }
                    var button = Ext.create('Ext.button.Button', action);
                    button.on('toggle', this.onToggle, this);
                    return button;
                }
            }
        };
        
        if (!this.config.tools) {
            this.config.tools = [];
        }
        
        // TODO: need to apply cls: 'oep-tools-last' to last item...
        var tbar = this.config.tools.map(createAction, this);
        
        // calc width of toolbar
        var width = 6; // padding
        tbar.forEach(function(item) {
            if (item){
                if (item.constructor == String) {
                    width += 1; // separator
                } else if (item.width) {
                    width += item.width;
                } else {
                    width += 24; // button
                }
                // add spacing to next control
                width += 8;
            }
        });
        width += 3; // padding
                
        // create toolbar as floating left panel if no renderTo target is configured
        if (this.gui.toolbar && !this.gui.toolbar.renderTo) {
            this.leftPanel = Ext.create('Ext.toolbar.Toolbar', Ext.apply({
                cls: 'oep-tools',
                y : 20,
                x : 80,
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
    createPanels: function(items) {
        
        // Checks whether the advanced or basic Layer control should be used
        if (this.gui.layers && this.gui.layers.type === 'advanced') {
            this.mapLayers = Ext.create('OpenEMap.view.layer.Advanced', Ext.apply({
                mapPanel : this.mapPanel,
                orginalConfig: this.orginalConfig
            }, this.gui.layers));
        } else {
            this.mapLayers = Ext.create('OpenEMap.view.layer.Basic', Ext.apply({
                mapPanel : this.mapPanel
            }, this.gui.layers));
        }
        
        // Create SearchParcel control
        this.searchFastighet = Ext.create('OpenEMap.view.SearchFastighet', Ext.apply({
            mapPanel : this.mapPanel,
            basePath: this.config.basePath,
            search: this.search 
        }, this.gui.searchFastighet));
        
        // Create Layer control
        // NOTE: only create right panel if layers panel isn't rendered
        // create right panel containing layers and search panels if no renderTo target is configured
        if (this.gui.layers && !this.gui.layers.renderTo) {
            
            var rightPanelItems = [this.mapLayers];
            
            if (this.gui.searchFastighet && !this.gui.searchFastighet.renderTo) {
                rightPanelItems.push(this.searchFastighet);
            }
            
            this.rightPanel = Ext.create('Ext.panel.Panel', {
                y : 20,
                layout : {
                    type: 'vbox',
                    align : 'stretch'
                },
                width : 300,
                border: false,
                style : {
                    'right' : '20px'
                },
                bodyStyle: {
                    background: 'transparent'
                },
                items : rightPanelItems
            });
        }
        
        // Create BaselLayers control
        // TODO: only create if config has baselayers
        if (!this.map.allOverlays && this.gui.baseLayers) {
            this.baseLayers = Ext.create("OpenEMap.view.BaseLayers", Ext.apply({
                mapPanel : this.mapPanel,
                y: 20,
                style: {
                    'right' : '45%'
                },
                width: 115
            }, this.gui.baseLayers));
        }
        
        // Create ZoomTool control
        if (this.gui.zoomTools && !this.gui.zoomTools.renderTo) {
            this.zoomTools = Ext.create('OpenEMap.view.ZoomTools', Ext.apply({
                mapPanel : this.mapPanel,
                x: 20,
                y: 20,
                width: 36
            }, this.gui.zoomTools));
        }
        
        // Create SearchCoordinate" control                
        // only create if renderTo
        if (this.gui.searchCoordinate && this.gui.searchCoordinate.renderTo) {
            this.searchCoordinate = Ext.create('OpenEMap.view.SearchCoordinate', Ext.apply({
                mapPanel : this.mapPanel
            }, this.gui.searchCoordinate));
        }
        
        // Create Object config
        // only create if renderTo
        if (this.gui.objectConfig && this.gui.objectConfig.renderTo) {
            this.objectConfig = Ext.create('OpenEMap.view.ObjectConfig', Ext.apply({
                mapPanel : this.mapPanel,
                gui: this
            }, this.gui.objectConfig));
        } else if (this.gui.objectConfig) {
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
    }
});