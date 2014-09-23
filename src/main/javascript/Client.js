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
 * Main map client class
 *  
 * Typical use case is to call the method configure(config) where config is a valid configuration object (usually parsed from JSON).
 */
Ext.define('OpenEMap.Client', {
    requires: ['GeoExt.data.MapfishPrintProvider',
               'OpenEMap.Gui',
               'OpenEMap.config.Parser',
               'OpenEMap.form.ZoomSelector',
               'OpenEMap.view.PopupResults',
               'OpenEMap.OpenLayers.Control.ModifyFeature',
               'OpenEMap.OpenLayers.Control.DynamicMeasure'],
    version: '1.0.4',
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
    drawLayer: null,
    /**
     * Configure map
     * 
     * If this method is to be used multiple times, make sure to call destroy before calling it.
     * 
     * @param {Object} config Map configuration object
     * @param {Object} options Additional MapClient options
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
     * 
     * For more information about the possible config properties for Ext JS components see Ext.container.Container.
     */
     configure: function(config, options) {
        options = Ext.apply({}, options);
        
        this.initialConfig = Ext.clone(config);
        
        Ext.tip.QuickTipManager.init();
        
        var parser = Ext.create('OpenEMap.config.Parser');

        this.map = parser.parse(config);
        this.gui = Ext.create('OpenEMap.Gui', {
            config: config,
            gui: options.gui,
            map: this.map,
            orginalConfig: this.initialConfig
        });
        this.mapPanel = this.gui.mapPanel;
        this.drawLayer = this.gui.mapPanel.drawLayer;
        
        if (this.gui.controlToActivate) {
            this.gui.controlToActivate.activate();
        }
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
     */
    toggleEdgeLabels: function(style) {
        var styleOverride = style || {};
        
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
                        label: lineString.getLength().toFixed(2).toString() + " m",
                        strokeColor: "#000000",
                        strokeWidth: 3,
                        labelAlign: 'cm'
                    });
                    var feature = new OpenLayers.Feature.Vector(centroid, null, style);
                    return feature;
                });
                
                return edgeLabels;
            }
            
            this.labelLayer.destroyFeatures();
            
            var edgeLabelsArrays = this.drawLayer.features.map(createEdgeLabels);
            if (edgeLabelsArrays.length > 0) {
                var edgeLabels = edgeLabelsArrays.reduce(function(a, b) {
                    return a.concat(b);
                });
                this.labelLayer.addFeatures(edgeLabels);
            }
        };
        
        if (this.labelLayer == null) {
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
     * Helper method to add add a new vector layer to map 
     * @param {string} geojson geojson with features that should be added to map 
     * @param {string} layername 
     * @param {OpenLayers.Feature.Vector.style} style Styling for features in the layer. Uses default style if not specified
     * @param {string} idAttribute name of the attribute stored in each feture that holds the a unique id. Defaults to 'id'
     * @param {string} popupAttribute name of the attribute stored in each feture that holds the information to be shown in a popup defaults to 'popupText'
     * @param {string} [popupTextPrefix] prefix to be shown in popup before the value in popupAttribute 
     * @param {string} [popupTextSuffix] suffix to be shown in popup before the value in popupAttribute 
     * @return {OpenLayers.Layer} referns to the layer added. null if layer cant be created 
     */
    addPopupLayer: function(geojson, layername, style, idAttribute, popupAttribute, popupTextPrefix, popupTextSuffix) {
        if (!geojson) {
        	return null;
        }
        if (!layername) {
        	// set default layer name 
        	layername = "VectorLayer";
        } 
        if (!style) {
			var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        } 
        if (!idAttribute) {
        	idAttribute = 'id';
        }
        
        if (!popupAttribute) {
        	popupAttribute = 'popupText';
        }

		if (!popupTextPrefix) {
			popupTextPrefix ='';
		}
		if (!popupTextSuffix) {
			popupTextSuffix = '';
		}
        var format = new OpenLayers.Format.GeoJSON();
        var features = format.read(geojson, "FeatureCollection");
	    if (!features) {
	    	return null;
	    } 
 
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
		
	    // creating a vector layer with specific options that apply to popup layers
	    var popupLayer = new OpenLayers.Layer.Vector(layername, {style: style, renderers: renderer, idAttribute: idAttribute, popupAttribute: popupAttribute, popupTextPrefix: popupTextPrefix, popupTextSuffix: popupTextSuffix} );
	  	this.map.addLayer(popupLayer);
 
		//var options = ?;
		popupLayer.addFeatures(features);
		
	    return popupLayer;
    },
    /**
     * Helper method to remove a popup layer
     */
    removePopupLayer: function(layer) {
		// TODO - only remove popup windows for this layer
		// remove any popup windows too
		var popup = layer.map.popup; 
    	if (popup) { 
			// Remove any popup window
			popup.forEach(function(item) {item.destroy();});
    	}
    	// Remove the layer
		mapClient.map.removeLayer(layer);
	    return true;
    },
	showPopupFeaturePopup: function(popupLayer, feature) {
    	// Destroy previously created popup
    	if (popupLayer.map.popup) { 
			// Remove any popup window
			this.map.popup.forEach(function(item) {item.destroy();});
    	}

    	// Create popup 
    	var popupText = popupLayer.popupTextPrefix+feature.attributes[popupLayer.popupAttribute]+popupLayer.popupTextSuffix;

    	// Create popup 
    	var popup = new OpenEMap.view.PopupResults({mapPanel : this.gui.mapPanel, location: feature, popupText: popupText});

		// Show popup
        popup.show();
		
		// Adds popup to array of popups in map  
        this.map.popup.push(popup);
	},
    /**
     * Helper method to remove a popup layer
     */
    showPopupFeature: function(popupLayer, featureId) {
    	if (!popupLayer) {
    		return false;
    	}
   	
    	var features = popupLayer.getFeaturesByAttribute(popupLayer.idAttribute, featureId);
    	// Check if there are any features matching id
    	if (features) {
    		// Check if there are more then one feature matching id
    		if (features.length == 1) {
	    		// Shows the first feature matching the id
	    		this.showPopupFeaturePopup(popupLayer, features[0]);

	    		// TODO - Highlight feature

		    	// Fire action "popupfeatureselected" on the feature including layer and featureid
		    	map.events.triggerEvent("popupfeatureselected",{layer: popupLayer, featureid: features[0].attributes[popupLayer.idAttribute]});
	    		return true;
    		} else {
    			return false;
    		}    		
    	} else {
    		return false;
    	}
    },
    /**
     * Helper method to destroy all popup layers 
     */
    destroyPopupLayers: function() {
        var parser = Ext.create('OpenEMap.config.Parser');
    	var popupLayers = parser.extractPopupLayers(this.map.layers);
		if (popupLayers) {
			// Remove popup layers
			popupLayers.forEach(function(layer) {this.mapClient.removePopupLayer(layer);});
		}
		
		// Remove popup window
		this.map.popup.forEach(function(p) {p.destroy();});
	    return true;
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
	        if (this.map.popup) {
				// Remove popup layers
				this.mapClient.destroyPopupLayers();
	        }
	        this.map.popup = null;
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
     * Base path to be used for all image resources
     * 
     * @property {string}
     */
    basePathImages: 'resources/images/',

    /**
     * WS paths to be used for AJAX requests
     * 
     * @property {object}
     */
    wsUrls: {
        basePath:   '/openemapadmin/',
        configs:    'configs',
        servers:    'settings/servers',
        layers:     'layers/layers',
        metadata:   'geometadata/getmetadatabyid', 
        metadata_abstract: 'geometadata/getabstractbyid'
    }
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
