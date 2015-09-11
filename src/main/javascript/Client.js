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
 * ###Main map client class
 *  
 * Typical use case is to call the method configure(config) where config is a valid configuration object (usually parsed from JSON).
 * ###[Integration example](https://github.com/Sundsvallskommun/OpenEMap-WebUserInterface/blob/master/README.md)
 */
Ext.define('OpenEMap.Client', {
    requires: ['GeoExt.data.MapfishPrintProvider',
               'OpenEMap.Gui',
               'OpenEMap.config.Parser',
               'OpenEMap.form.ZoomSelector',
               'OpenEMap.view.PopupResults',
               'OpenEMap.OpenLayers.Control.ModifyFeature',
               'OpenEMap.OpenLayers.Control.DynamicMeasure'],
    version: '1.6.1-hf.1',
    /**
     * OpenLayers Map instance
     * 
     * @property {OpenLayers.Map}
     */
    map: null,
    /**
     * Overlay used by drawing actions
     * 
     * StyleMap can be overridden if more specific styling logic is required. 
     * 
     * Here is an example that changes style on scale:
     * 
     *     var style = new OpenLayers.Style();
     * 
     *     var ruleLow = new OpenLayers.Rule({
     *       symbolizer: {
     *         pointRadius: 10,
     *         fillColor: 'green',
     *         fillOpacity: 1
     *       },
     *       maxScaleDenominator: 10000
     *     });
     * 
     *     var ruleHigh = new OpenLayers.Rule({
     *       symbolizer: {
     *         pointRadius: 10,
     *         fillColor: 'red',
     *         fillOpacity: 1   
     *      },
     *      minScaleDenominator: 10000
     *     });
     * 
     *     style.addRules([ruleLow, ruleHigh]);
     * 
     *     var styleMap = new OpenLayers.StyleMap(style);
     *     mapClient.drawLayer.styleMap = styleMap;
     *     
     * Here is an example style to display labels for features with attribute property "type" == "label":
     * 
     *     var labels = new OpenLayers.Rule({
     *       filter: new OpenLayers.Filter.Comparison({
     *         type: OpenLayers.Filter.Comparison.EQUAL_TO,
     *         property: "type",
     *         value: "label",
     *       }),
     *       symbolizer: {
     *         label: "${label}"
     *       }
     *     });
     * 
     * See [OpenLayers documentation][1] on feature styling for more examples.
     * 
     * [1]: http://docs.openlayers.org/library/feature_styling.html
     * 
     * @property {OpenLayers.Layer.Vector}
     */
    drawLayer: undefined,
    /**
     * Configure map
     * 
     * If this method is to be used multiple times, make sure to call destroy before calling it.
     * 
     * @param {Object} config Map configuration object
     * @param {Object} options Additional MapClient options
     * @param {Function options.callback Callback that is called when the client is configured and ready 
     * @param {Object} options.gui Options to control GUI elements. Each property in this object is
     * essentially a config object used to initialize an Ext JS component. If a property is undefined or false
     * that component will not be initialized except for the map component. If a property is a defined
     * but empty object the component will be rendered floating over the map. To place a component into a 
     * predefined html tag, use the config property renderTo.
     * @param {Object} options.gui.map If undefined or false MapClient will create the map in a full page viewport
     * @param {Object} options.gui.layers Map layers tree list
     * @param {Object} options.gui.baseLayers Base layer switcher intended to be used as a floating control
     * @param {Object} options.gui.searchCoordinate Simple coordinate search and pan control
     * @param {Object} options.gui.objectConfig A generic form to configure feature attributes similar to a PropertyList
     * @param {Object} options.gui.zoomTools Zoom slider and buttons intended to be used as a floating control
     * @param {Object} options.gui.searchFastighet Search "fastighet" control
     * @param {Object} options.gui.showCoordinate Simple control to show map coordinates 
     * 
     * For more information about the possible config properties for Ext JS components see Ext.container.Container.
     */
     configure: function(config, options) {
        options = Ext.apply({}, options);
        
        this.initialConfig = Ext.clone(config);
        this.initialOptions = Ext.clone(options);
        
        Ext.tip.QuickTipManager.init();
        
        var parser = Ext.create('OpenEMap.config.Parser');

        this.map = parser.parse(config);
        this.gui = Ext.create('OpenEMap.Gui', {
            config: config,
            gui: options.gui,
            map: this.map,
            client: this,
            orginalConfig: this.initialConfig
        });
        this.mapPanel = this.gui.mapPanel;
        this.drawLayer = this.gui.mapPanel.drawLayer;
        
        if (this.gui.controlToActivate) {
            this.gui.controlToActivate.activate();
        }
        
        if (options.callback) {
            options.callback.call(this);
        }
    },
    getPermalinkdata: function() {
        var features = this.drawLayer.features;
        var format = new OpenLayers.Format.GeoJSON();
        var geojson = format.write(features);
    
        return {
            version: this.version,
            config: this.getConfig(),
            options: this.initialOptions,
            extent: this.map.getExtent().toArray(),
            drawLayer: {
                geojson: geojson
            }
        };
    },
    /**
     * @param {boolean} includeLayerRef include reference to OpenLayers layer if available
     * @return {Object} Object representation of current Open eMap configuration
     */
    getConfig: function(includeLayerRef) {
       return this.gui.mapLayers.getConfig(includeLayerRef); 
    },
    /**
     * @param {String=} Name of layout to use (default is to use first layout as reported by server)
     * @return {String} JSON encoding of current map for MapFish Print module
     */
    encode: function(layout) {
        return JSON.stringify(this.mapPanel.encode(layout));
    },
    /**
     * Helper method to add GeoJSON directly to the draw layer
     * 
     * @param {string} geojson
     */
    addGeoJSON: function(geojson) {
        var format = new OpenLayers.Format.GeoJSON();
        var feature = format.read(geojson, "Feature");
        
        if (feature.attributes.config) {
            var objectFactory = Ext.create('OpenEMap.ObjectFactory');
            feature = objectFactory.create(feature.attributes.config, feature.attributes);
        }
        
        this.drawLayer.addFeatures([feature]);
    },
    /**
     * Allows you to override the sketch style at runtime
     * 
     * @param {OpenLayers.StyleMap} styleMap
     */
    setSketchStyleMap: function(styleMap) {
        this.map.controls.forEach(function(control) {
            if (control instanceof OpenLayers.Control.DrawFeature) {
                control.handler.layerOptions.styleMap = styleMap;
                if (control.handler.layer) {
                    control.handler.layer.styleMap = styleMap;
                }
            }
        });
    },
    /**
     * Enable additional labels for polygon edges
     * NOTE: deactivation not yet implemented
     * @param style hash of style properties that will override a default label style
     * @param {number} [accuracy=2] number of digits for edge labels 
     */
    toggleEdgeLabels: function(style, accuracy) {
        var styleOverride = style || {};
		function isInt(value) {
		  return !isNaN(value) && 
		         parseInt(Number(value)) == value && 
		         !isNaN(parseInt(value, 10));
		}
        if (!isInt(accuracy)) {
        	accuracy = 2;
        }
        
        var drawLabels = function() {
            var createEdgeLabels = function(feature) {
                var geometry = feature.geometry;
                
                if (geometry.CLASS_NAME != "OpenLayers.Geometry.Polygon") return [];
                
                var linearRing = geometry.components[0];
                
                var edgeLabels = linearRing.components.slice(0, linearRing.components.length-1).map(function(point, i) {
                    var start = linearRing.components[i].clone();
                    var end = linearRing.components[i+1].clone();
                    var lineString = new OpenLayers.Geometry.LineString([start, end]);
                    var centroid = lineString.getCentroid({weighted: true});
                    var style = Ext.applyIf(Ext.clone(styleOverride), {
                        label: lineString.getLength().toFixed(accuracy).toString() + " m",
                        strokeColor: "#000000",
                        strokeWidth: 0,
                        labelAlign: 'cm',
                        pointRadius: 0
                    });
                    var feature = new OpenLayers.Feature.Vector(centroid, null, style);
                    return feature;
                });
                
                return edgeLabels;
            };
            
            if (this.labelLayer) {
            	this.labelLayer.destroyFeatures();
            }
            
            var edgeLabelsArrays = this.drawLayer.features.map(createEdgeLabels);
            if (edgeLabelsArrays.length > 0) {
                var edgeLabels = edgeLabelsArrays.reduce(function(a, b) {
                    return a.concat(b);
                });
                this.labelLayer.addFeatures(edgeLabels);
            }
        };
        
        if (this.labelLayer === undefined) {
            this.labelLayer = new OpenLayers.Layer.Vector();
            this.map.addLayer(this.labelLayer);
            
            this.drawLayer.events.on({
                "featuremodified": drawLabels,
                "vertexmodified": drawLabels,
                "featuresadded": drawLabels,
                "featuresremoved": drawLabels,
                scope: this 
            });
        } else {
            // TODO: disable edge labels
        }
        
        drawLabels.apply(this);
    },
    /**
     * Helper method to add add a new vector layer to map.
     * @param {string} geojson GeoJSON with features that should be added to map 
     * @param {string} layername Layer name 
     * @param {string} [idAttribute='id'] Name of the attribute stored in each feture that holds the a unique id. Defaults to 'id'. Must be unique.
     * @param {string} [popupTextAttribute] Name of the attribute stored in each feture that holds the information to be shown in a popup. Set to null or undefined to not show popup
     * @param {string} [popupTextPrefix=''] Prefix to be shown in popup before the value in popupTextAttribute 
     * @param {string} [popupTextSuffix=''] Suffix to be shown in popup before the value in popupTextAttribute
     * @param {string} [popupTitleAttribute=null] Title for the popup
     * @param {OpenLayers.Feature.Vector.Stylemap} [stylemap=deafult style] Stylemap used when drawing features in the layer. Uses default style if not specified
     * @param {string} [epsg='EPSG:3006'] Coordinate system reference according to EPSG-standard, defaults to 'EPSG:3006' (Sweref 99 TM) 
     * @param {Boolean} [zoomToBounds=true] Flags whether map should be zoomed to extent of features when the layer is added, defaults to true
     * @return {OpenLayers.Layer} Returns the layer added. null if layer cant be created
     */
    addPopupLayer: function(geojson, layername, idAttribute, popupTextAttribute, popupTextPrefix, popupTextSuffix, popupTitleAttribute, stylemap, epsg, zoomToBounds) {
        if (!geojson) {
			Ext.Error.raise('GeoJSON-string is null.');
        }
        if (!layername) {
        	// set default layer name 
        	layername = "VectorLayer";
        } 
        if (!idAttribute) {
        	idAttribute = 'id';
        }
        
		if (!popupTextPrefix) {
			popupTextPrefix ='';
		}
		if (!popupTextSuffix) {
			popupTextSuffix = '';
		}
		if (!popupTitleAttribute) {
			popupTitleAttribute =null;
		}
		if (!epsg) {
			epsg = 'EPSG:3006';
		} 
		if (!Proj4js.defs[epsg])
		{
			Ext.Error.raise('Unknown coordinate system: ' + epsg + '\nAdd coordinate system using proj4.defs(\'Name\', \'Definition\')');
		}
		if (zoomToBounds === null) {
			zoomToBounds = true;
		} 

        var format = new OpenLayers.Format.GeoJSON();

		//  Projection settings 
 		var fromProjection = epsg;
        var toProjection = this.map.projection;
        format.internalProjection = new OpenLayers.Projection(toProjection);
        format.externalProjection = new OpenLayers.Projection(fromProjection);

        var features = format.read(geojson, "FeatureCollection");
	    if (!features) {
			Ext.Error.raise('Can not read features from GeoJSON due to malformed syntax.' );
	    }
 		
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
		
	    // creating a vector layer with specific options that apply to popup layers
	    var popupLayer = new OpenLayers.Layer.Vector(layername, {renderers: renderer, idAttribute: idAttribute, popupTextAttribute: popupTextAttribute, popupTextPrefix: popupTextPrefix, popupTextSuffix: popupTextSuffix, popupTitleAttribute: popupTitleAttribute} );
	    if (!popupLayer){
			Ext.Error.raise('Can not create popup layer: ' + layername);
	    }

		// Creates stylemap to use when drawing features of popup layer
        if (stylemap) {
			popupLayer.styleMap = stylemap;
        }
        
        // Add layer to map 
	  	this.map.addLayer(popupLayer);
 
		// Add features to layer
		popupLayer.addFeatures(features);
		
		// Set feature render intent an draws them
		var featureBounds = new OpenLayers.Bounds();
 		features.forEach(function(feature) {
 			feature.renderIntent='default';
 			featureBounds.extend(feature.geometry.getBounds());
 			popupLayer.drawFeature(feature);
		});
		
		popupLayer.popup = [];
		
		// Zoom to bounds of all features
		if (zoomToBounds) {
			popupLayer.map.zoomToExtent(featureBounds);
		}

	    return popupLayer;
    },
    /**
     * Helper method to remove a popup layer
     * @param {OpenLayers.Layer.Vector} [layer] Layer to remove
     */
    removePopupLayer: function(layer) {
		// remove any popup windows too
		if (layer.popup) { 
			// Remove any popup window
			layer.popup.forEach(function(p) {
				p.destroy();
				p = null;
			});
			layer.popup = [];
    	}
    	// Remove the layer
		layer.map.removeLayer(layer);
    },
    /**
     * Show popup for a feature
     * @private 
     * @param {OpenLayers.Layer.Vector} [popupLayer] layer to search for features
     * @param {OpenLayers.Feature} [feature] feature to show popup on
     */
	showPopupFeaturePopup: function(popupLayer, feature) {
    	// Destroy previously created popup
    	if (popupLayer.popup) { 
			// Remove any popup window
			popupLayer.popup.forEach(function(item) {item.destroy();});
    	}

    	// get text to populate popup 
    	var popupText = popupLayer.popupTextPrefix+feature.attributes[popupLayer.popupTextAttribute]+popupLayer.popupTextSuffix;
    	var popupTitle = '';
    	if (popupLayer.popupTitleAttribute) {
    		popupTitle = feature.attributes[popupLayer.popupTitleAttribute];
    	}

    	// Create popup 
    	var popup = new OpenEMap.view.PopupResults({mapPanel : this.gui.mapPanel, location: feature, popupText: popupText, feature: feature, title: popupTitle});

		// Show popup
        popup.show();
		
		// Adds popup to array of popups in map  
        popupLayer.popup.push(popup);
	},
    /**
     * Search for a feature inside a popup layer and show a popup if it matches. 
     * @param {OpenLayers.Layer.Vector} [popupLayer] Layer to search for features
     * @param {number} [featureId] Feature-id to search for
     * @param {boolean} [center] Whether to center over clicked position or not.  
     */
    showPopupFeature: function(popupLayer, featureId, center) {
    	if (!popupLayer) {
			Ext.Error.raise('Popup layer undefined.');
    	}
    	if (!featureId) {
			Ext.Error.raise('Feature id undefined.');
    	}
   	
    	var features = popupLayer.getFeaturesByAttribute(popupLayer.idAttribute, featureId);
    	// Check if there are any features matching id
    	if (features) {
    		// Check if there are more then one feature matching id
    		if (features.length == 1) {
	    		// Remove highlight feature
                var parser = Ext.create('OpenEMap.config.Parser');
                var popupLayers = parser.extractPopupLayers(popupLayer.map.layers);
				popupLayers.forEach(function(popupLayer) {
		    		popupLayer.features.forEach(function(feature) {
		    			if (feature.renderIntent == 'select') {
				    		feature.renderIntent = 'default';
				    		feature.layer.drawFeature(feature);
					    	// Fire action "popupfeatureunselected" on the feature including layer and featureid
					    	feature.layer.map.events.triggerEvent("popupfeatureunselected",{layer: popupLayer, featureid: feature.attributes[popupLayer.idAttribute]});
				    	}
		    		});
		    		// Remove popups too
		    		popupLayer.popup.forEach(function(item) {item.destroy();});
				});
				
      			if ((typeof popupLayer.popupTextAttribute !== 'undefined') && (popupLayer.popupTextAttribute !== null)) {
		    		// Shows the first feature matching the id
		    		this.showPopupFeaturePopup(popupLayer, features[0]);
		    	}

	    		// Highlight feature
	    		features[0].renderIntent = 'select';
	    		if (center) {
	    			var centerPoint = features[0].geometry.getCentroid();
	    			features[0].layer.map.setCenter([centerPoint.x,centerPoint.y]);
	    		}
	    		features[0].layer.drawFeature(features[0]);

		    	// Fire action "popupfeatureselected" on the feature including layer and featureid
		    	features[0].layer.map.events.triggerEvent("popupfeatureselected",{layer: popupLayer, featureid: features[0].attributes[popupLayer.idAttribute]});
    		} else {
				Ext.Error.raise('More then one feature with specified id: ' + featureId);
    		}    		
    	} else {
			Ext.Error.raise('No feature with specified id: ' + featureId);
    	}
    },
    /**
     * Helper method to destroy all popup layers 
     */
    destroyPopupLayers: function() {
        var parser = Ext.create('OpenEMap.config.Parser');
    	var popupLayers = parser.extractPopupLayers(this.map.layers);
    	var mapClient = this;
		if (popupLayers) {
			// Remove popup layers
			popupLayers.forEach(function(layer) {
				mapClient.removePopupLayer(layer);
			});
		}
    },
    /**
     * Clean up rendered elements
     */
    destroy: function() {
        if (this.map) {
        	if (this.map.controls) {
	            this.map.controls.forEach(function(control) { control.destroy(); });
	            this.map.controls = null;
            }
	        if (this.map.layers) {
				// Remove popup layers
				this.destroyPopupLayers();
	        }
        }
        if (this.gui) this.gui.destroy();
    }
});

Ext.ns('OpenEMap');

Ext.apply(OpenEMap, {
    lmUser: 'sundsvall',
    /**
     * Base path to be used for mapfish print servlet requests
     * 
     * @property {string}
     */
    basePathMapFish: '/print/pdf',
    /**
     * Base path to be used for all AJAX requests against search-lm REST API
     * 
     * @property {string}
     */
    basePathLM: '/search/lm/',
    /**
     * @property {string} 
     * Base path to be used for all AJAX requests against Elasticsearch REST API
     */
    basePathES: '/search/es/',
    /**
     * Base path to be used for all image resources
     * 
     * @property {string}
     */
    basePathImages: 'resources/images/',

    basePathWMS: '/geoserver/wms',
    
    /**
     * URL/paths related to WMS usage / advanced layer list
     */
    wmsURLs: {
        /**
         * URL to be used to fetch WMS capabilities etc. for add layer UI
         */
        basePath: '/geoserver/wms',
        /**
         * URL to be used when WMS layer has been added to config
         */
        url: 'https://extmaptest.sundsvall.se/geoserver/wms',
        /**
         * URL to getcapabilities document. Must include request parameter (eg. https://extmap.sundsvall.se/geoserver/wms?request=GetCapabilities&version=1.1.1) 
         */
        getCapabilities: 'https://extmaptest.sundsvall.se/getcapabilities/wms.xml'
    },

    /**
     * @property {string} 
     * Base path to proxy to be used for WFS-post
     */
    basePathProxy: '/cgi-bin/proxy.py?url=',

    /**
     * @property {Object} [wsUrls] WS paths to be used for AJAX requests
     * @property {string} [wsUrls.basePath] basepath to Open eMap Admin services 
     * @property {string} [wsUrls.configs] relative path to publig configs within Open eMap Admin services
     * @property {string} [wsUrls.adminconfigs] path to admin config service within Open eMap Admin services 
     * @property {string} [wsUrls.permalinks] path to Open eMap Permalink service 
     * @property {string} [wsUrls.metadata]  path to Open eMap Geo Metadata service
     * @property {string} [wsUrls.metadataAbstract] path to Open eMap Geo Metadata Abstract service
     * @property {string} [wsUrls.servers] unused
     * @property {string} [wsUrls.layers] unused 
     */
    wsUrls: {
        basePath:   	'/openemapadmin',
        permalinks:     '/openemappermalink/permalinks',
        configs:    	'/configs',
        adminconfigs: 	'/adminconfigs',
        servers:    	'settings/servers',
        layers:     	'layers/layers',
        metadata:   	'geometadata/getmetadatabyid', 
        metadata_abstract: 'geometadata/getabstractbyid'
    },
    /**
     * @property {String} user to use when saving map config 
     */
    username: null
});

Ext.apply(OpenEMap, {
    /**
     * Wrapped Ext.Ajax.request method that applies base path and user
     */
    requestLM: function(config) {
        config.url = OpenEMap.basePathLM + config.url + '&lmuser=' + OpenEMap.lmUser;
        Ext.Ajax.request(config);
    }
});


OpenLayers.Layer.Vector.prototype.renderers = ["Canvas", "SVG", "VML"];
// Setting resolution to coerce with GeoWebCache
OpenLayers.DOTS_PER_INCH = 90.71446714322;
 						   
	/**
	 * @event popupfeatureselected 
	 * fires when a feature in a popup layer is selected
	 * @param {OpenLayers.layer} layer popup layer
	 * @param {number} featureid id of selected feature 
	 */
	/**
	 * @event popupfeatureunselected 
	 * fires when a previously selected feature in a popup layer gets unselected
	 * @param {OpenLayers.layer} layer popup layer
	 * @param {number} featureid id of unselected feature 
	 */
