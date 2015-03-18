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
 * ###Parser for configuration JSON
 * Sets defaults, initializes OpenLayers and Ext JS stuff.
 * ###[Config documentation](https://github.com/Sundsvallskommun/OpenEMap-WebUserInterface/blob/master/doc/config.md)
 * ###[Config example](https://github.com/Sundsvallskommun/OpenEMap-WebUserInterface/blob/develop/doc/testAll.json)
 */
Ext.define('OpenEMap.config.Parser', {
    requires : [ 
        'OpenEMap.data.Servers',
        'Ext.Ajax' 
    ],

    constructor: function(config) {
        Ext.apply(this, config);
        this.callParent(arguments);
    },

    /**
     * Parse configuration JSON
     * 
     * Set defaults, initializes OpenLayers and Ext JS stuff.
     */
    parse : function(config) {
        // construct OpenLayers.Map options object
        var options = {
            "fallThrough" : true,
            "controls": ["Navigation", "KeyboardDefaults"],
            "projection": "EPSG:3006",
            "resolutions": [280, 140, 70, 28, 14, 7, 4.2, 2.8, 1.4, 0.56, 0.28, 0.14, 0.112],
            "extent": [608114, 6910996, 641846, 6932596],
            "maxExtent": [487000.0, 6887000.0, 749144.0, 7149144.0],
            "units": "m",
            "municipalities": ['Sundvsall', 'Timrå', 'Kramfors', 'Örnsköldsvik', 'Härnösand']
        };
        
        options.resolutions = config.resolutions || options.resolutions;
        options.units = config.units || options.units;
        options.projection = config.projection || options.projection;
        options.maxExtent = config.maxExtent;
        options.extent = config.extent;
        options.municipalities = config.municipalities || options.municipalities;
        options.controls = options.controls.map(this.createControl);
        
        // allow to override/add other options from map property 
        Ext.apply(options, config.map);
        
        // transform layers for backward compat
        layers = config.layers.map(this.transformLayer);
        
        // Create a Extjs layertree from configuration
        var layerTree = this.parseLayerTree(layers);

        // filter out plain layer definitions (no group)
        var layers = this.extractLayers(layerTree);
        
        options.allOverlays = !layers.some(this.isBaseLayer, this);
        
        // Create OpenLayers.Layer.WMS from layer definitions that describe WMS source
        options.layers = layers
            //.filter(this.isWMSLayer)
            .map(function(layer) {
                return layer.layer;
            });
        
        options.layers = options.layers.filter(function(layer) { return layer; });
        
        var map = new OpenLayers.Map(options);
        // Store a reference to the full layer tree
        map.layerTree = layerTree;
        // Store a reference to the layer switcher layer tree
        map.layerSwitcherLayerTree = this.getLayerSwitcherLayers(layerTree);

        return map;
    },

    /**
    * Iterate over the layertree and create a ExtJS-tree structure
    * @private
    */
    parseLayerTree: function(layers) {
        layers.forEach(this.iterateLayers, this);
        return layers;
    },

    /**
    * Get all layers and layer groups that should show up in the layer switcher
    */
    // TODO - implement support for config tag layer.wms.options.displayInLayerSwitcher
    getLayerSwitcherLayers: function(layers) {
        return layers.filter(function(layer) { 
            return (layer.layers || (this.isWMSLayer(layer) && !this.isBaseLayer(layer))) ? true : false;
        }, this);
    },

    /**
     * Process layers config to return a flat array with layer definitions
     */
    extractLayers: function(layers) {
        // filter out plain layer definitions (no group)
        var plainLayers = layers.filter(function(layer) { return !layer.layers; });
/*        var plainLayers = layers.filter(function(layer) {
        	// Checking layer.layers for backward compability
        	if (layer.isGroupLayer === undefined) {layer.isGroupLayer = layer.layers ? true : false} 
        	return !layer.isGroupLayer; 
        });
*/
        // filter out groups
        var groups = layers.filter(function(layer) { return layer.layers; }).map(function(layer) { return layer.layers; });  
        
        // flatten groups into an array of layer definitions 
        var flattenedGroups = [].concat.apply([], groups);
        // concat all layer definitions
        layers = plainLayers.concat(flattenedGroups);
        // Reverse layers to make the top layer in config land on top in OpenLayers
        layers.reverse();

        return layers;
    },
    /**
     * Extract plain layers from a layertree structure
     * @param layers [Array] array of layers in a tree structure 
     */
    extractPlainLayers: function(layers) {
    	var plainLayers = [];
    	for (var i=0,  tot=layers.length; i < tot; i++) {
   			plainLayers.push(layers[i]);
    		if (layers[i].layers) {
    			plainLayers = plainLayers.concat(this.extractPlainLayers(layers[i].layers));
    		}
    	}
    	return plainLayers;
    },
    /**
     * Extracts WFS-layers
     * @param layers [Array] array of layers
     */
    extractWFS: function(layers) {
        layers = layers.filter(function(layer){ return (layer.wfs && layer.wfs.url); });
        return layers;
    },
    /**
     * Extracts layers missing WFS-tag
     * @param layers [Array] array of layers
     */
    extractNoWFS: function(layers) {
        layers = layers.filter(function(layer){ return !(layer.wfs && layer.wfs.url); });
        return layers;
    },
    /**
     * Extracts layers with valid WMS-tag
     * @param layers [Array] array of layers
     */
    extractWMS: function(layers) {
        layers = layers.filter(function(layer){ return (layer.wms && layer.wms.url); });
        return layers;
    },
    /**
     * Extracts queryable layers
     * @param plainLayers [array] array of flattened layers. 
     */
    extractClickableLayers: function(plainLayers) {
        plainLayers = plainLayers.filter(function(layer) { 
        	return (layer.clickable && layer.queryable); 
        });
        return plainLayers;
    },
    /**
     * Extracts visible layers
     * @param plainLayers [array] array of flattened layers. 
     */
    extractVisibleLayers: function(plainLayers) {
        plainLayers = plainLayers.filter(function(layer) { 
        	return (layer.layer && layer.layer.visibility); 
        });
        return plainLayers;
    },
    /**
     * Extracts Vector-layers
     */
    extractVector: function(layers) {
        layers = this.extractLayers(layers);
        layers = layers.filter(function(layer){ return layer.vector; });
        return layers;
    },
    /**
     * Extracts base-layers
     */
    extractBaseLayers: function(layers) {
        layers = this.extractLayers(layers);
        layers = layers.filter(function(layer){ return layer.isBaseLayer; });
        return layers;
    },
    /**
     * Process layers config to return a flat array with popupLayer definitions
     */
    extractPopupLayers: function(layers) {
        layers = this.extractLayers(layers);
        layers = layers.filter(function(layer) {
        	if (layer.idAttribute && layer.popupTextAttribute) {
        		return true;
        	} else {
        		return false;
        	} 
    	});
    	layers = layers.filter(function(layer){return layer.visibility;});
        return layers;
    },
    getOptions: function(layer) {
        if (layer.wms) {
            return layer.wms.options;
        } else if (layer.osm) {
            return layer.osm.options;
        } else if (layer.google) {
            return layer.google.options;
        } else if (layer.bing) {
            return layer.bing.options;
        }
    },
    isOpenLayersLayer: function(layer) {
        if (layer.wms || layer.osm || layer.google || layer.bing) {
            return true;
        } else {
            return false;
        }
    },
    isBaseLayer: function(layer) {
        var options = this.getOptions(layer);
        if (options && options.isBaseLayer) {
            return true;
        } else {
            return false;
        }
    },
    createControl: function(control) {
        if (control.constructor == String) {
            return new OpenLayers.Control[control]();
        } else {
            return new OpenLayers.Control[control.type](control.options);
        }
    },
    isWMSLayer: function(layer) {
        return layer.wms ? true : false;
    },
    /**
     * Transform layer definition for back compatibility reasons
     */
    transformLayer: function(layer) {
        // if layer def has url assume it should be moved to wms property
        if (layer.url) {
            layer.wms = {
                    url: layer.url,
                    params: layer.params,
                    options: layer.options
            };
        }
        return layer;
    },
    createLayer: function(layer) {
        if (layer.wms) {
            return new OpenLayers.Layer.WMS(layer.name, layer.wms.url, layer.wms.params, layer.wms.options);
        } else if (layer.osm) {
            return new OpenLayers.Layer.OSM(layer.name, layer.osm.url, layer.osm.options);
        } else if (layer.google) {
            return new OpenLayers.Layer.Google(layer.name, layer.google.options);
        } else if (layer.bing) {
            return new OpenLayers.Layer.Bing(Ext.apply({name: layer.name}, layer.bing.options));
        } else {
            throw new Error("Unknown layer type");
        }
    },
	/**
	 *	Checks if the layer or any sublayer is checked
	 *	@private 
	 *  @param layer [Object] layer object in the config structure
	 */
	isLayerChecked: function(layer) {
		if (layer.isGroupLayer && layer.layers && layer.layers.length) {
			return layer.layers.some(this.isLayerChecked, this);
		} else {
			return layer.wms && layer.wms.options && layer.wms.options.visibility ? layer.wms.options.visibility : false;
		}
	},
	/**
	 *	Sets properties for layers based on config options and creates OpenLayers layer 
	 *	@private 
	 *  @param layer [Object] layer object in the config structure
	 */
    iterateLayers: function(layer) {
        // Set node text
        layer.text = layer.name;
        // Is node checked?
        layer.checked = this.isLayerChecked(layer);
         
        // Get url from Server and set to layer
        if(typeof layer.serverId !== 'undefined' && layer.serverId !== '') {
            var server = this.serverStore.getById(layer.serverId);
            if(server) {
                if(layer.wms && !layer.wms.url) {
                    var wmsService = '/wms';
                    if(layer.wms.gwc) {
                        wmsService = '/gwc/service/wms';
                    }
                    layer.wms.url = server.get('url') + wmsService;
                }

                if(layer.wfs && !layer.wfs.url) {
                    layer.wfs.url = server.get('url');
                }
            }
        }

        // Create and store a reference to OpenLayers layer for this node
        if(this.isOpenLayersLayer(layer)) {
            layer.layer = this.createLayer(layer);
            layer.layer.queryable = layer.queryable ? layer.queryable : false;
        }
        // Do the node have sublayers, iterate over them
        if(layer.layers && (Object.prototype.toString.call(layer.layers) === '[object Array]') && layer.layers.length > 0) {
            layer.isGroupLayer = true;
            layer.expanded = layer.expanded === undefined ? true : layer.expanded;
            layer.layers.forEach(arguments.callee, this);
        } else {
            // If no sublayers, this is a leaf
            layer.leaf = true;
        }
    }

});
