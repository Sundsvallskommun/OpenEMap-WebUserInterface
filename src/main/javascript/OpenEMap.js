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
 * ###Factory for creating a Open eMap application
 *  
 * Call the method initOpenEMap(configPath, options)
 * ###[Integration example](https://github.com/Sundsvallskommun/OpenEMap-WebUserInterface/blob/master/README.md)
 */
var version = "-1.6";
var openEMapScriptLocation;

var loadCssFiles = function(files, callback) {
	var fileCounter = 0;
	var file;
	var obj;
	var cssFilesIndex = document.styleSheets.length - 1;

	for (var index in files) {
		fileCounter++;
		if(checkFileType(files[index])) {
			var link = document.createElement("link");
			link.href = files[index];
			link.rel = "stylesheet";
			link.type = "text/css";
			link.onload = checkFinishedState;
			if (this.readyState === 'loaded' || this.readyState === 'complete') {
				link.onreadystatechange = checkFinishedState();
			}
			document.getElementsByTagName("head")[0].appendChild(link);
			cssFilesIndex++;
			if (!window.opera && navigator.userAgent.indexOf("MSIE") == -1) {
				checkCSSLoadingState(cssFilesIndex);
			}
		}
	}

	function checkFileType(f) {
		f = f.toLowerCase();
	    var cssIndex = f.indexOf("css");
	    if(cssIndex == -1) {
	    	return false;
	    }
	    return true;
	}
	
	function checkCSSLoadingState(index) {
		try {
			if (document.styleSheets[index].cssRules) {
				checkFinishedState();
			} else {
				if (document.styleSheets[index].rules && document.styleSheets[index].rules.length) {
					checkFinishedState();
				} else {
					setTimeout(function() { checkCSSLoadingState(index); }, 250);
				}
			}
		} catch (e) {
			setTimeout(function() { checkCSSLoadingState(index); }, 250);
		}
	}

	function checkFinishedState() {
		fileCounter--;
		if (fileCounter === 0) {
			callback();
			fileCounter = -1;
		}
	}
};

var loadJsScripts = function(files) {
	var head = document.getElementsByTagName("head")[0];
	var waitUntilDependenciesIsLoaded = function(dependencies, script) {
		if (dependencies()) {
			head.appendChild(script);
		} else {
			setTimeout(function() { waitUntilDependenciesIsLoaded(dependencies, script); }, 5);
		}
	};
	
    for (var i = 0; i < files.length; i++) {
		var script = {};
		script = document.createElement('script');
		script.type = 'text/javascript';
	 	script.src = files[i].src;

    	waitUntilDependenciesIsLoaded(files[i].dependencies, script);
    }
};

(function () {
	var scriptNameRaw = "OpenEMap.js";
	var openEMapScriptName = new RegExp("(^|(.*?\\/))(" + scriptNameRaw + ")(\\?|$)");
	var scripts = document.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; i++) {
		var src = scripts[i].getAttribute('src');
		if (src) {
			var match = src.match(openEMapScriptName);
            if (match) {
            	openEMapScriptLocation = match[1];
            	break;
            }
        }
    }
	
	var cssFiles = [
		openEMapScriptLocation + "lib/ext-theme-oep/ext-theme-oep-all.css",
		openEMapScriptLocation + "resources/css/OpenEMap.css"
	];

	scripts = [
		{src: openEMapScriptLocation + "lib/ext/ext-all-debug.js", dependencies: function() {return true;}},
		{src: openEMapScriptLocation + "lib/ext/ext-theme-neptune.js", dependencies: function() {return (typeof Ext !== "undefined" && Ext.isReady);}},
		{src: openEMapScriptLocation + "lib/ext/locale/ext-lang-sv_SE.js", dependencies:  function() {return (typeof Ext !== "undefined" && Ext.isReady);}},
		{src: openEMapScriptLocation + "lib/OpenLayers/OpenLayers.debug.js", dependencies: function() {return true;}},
		{src: openEMapScriptLocation + "lib/proj4js/proj4-compressed.js", dependencies: function() {return true;}},
		{src: openEMapScriptLocation + "proj4_defs.js", dependencies: function() {return (typeof Proj4js !== "undefined");}},
		{src: openEMapScriptLocation + "lib/geoext/geoext-debug.js", dependencies: function() {return ((typeof Ext !== "undefined") && Ext.isReady &&  (typeof OpenLayers !== "undefined"));}},
		{src: openEMapScriptLocation + "lib/es5-shim/es5-shim.min.js", dependencies: function() {return true;}},
		{src: openEMapScriptLocation + "OpenEMap-debug.js", dependencies:  function() {return ((typeof Ext !== "undefined") && Ext.isReady &&  (typeof OpenLayers !== "undefined") && (typeof Proj4js !== "undefined") && (typeof GeoExt !== "undefined"));}}
    ];
	
	// Ensure css files are loaded before js files
	loadCssFiles(cssFiles, function() {
		loadJsScripts(scripts);
	});
}) ();


var waitUntilOpenEMapIsLoaded = function(callback, conf, options) {
	if ((typeof OpenEMap === "undefined") || (typeof OpenEMap.Client === "undefined")) {
		setTimeout(function() { waitUntilOpenEMapIsLoaded(callback, conf, options); }, 5);
	} else {
		Ext.apply(OpenEMap, options.OpenEMap);
		return callback(conf);
	}
};

/**
* Initialize the map
* @param {string}configPath path to config
* @param {Object} options Additional MapClient options
* @param {Object} options.gui Options to control GUI elements. Each property in this object is
* essentially a config object used to initialize an Ext JS component. If a property is undefined or false
* that component will not be initialized except for the map component. If a property is a defined
* but empty object the component will be rendered floating over the map. To place a component into a 
* predefined html tag, use the config property renderTo.
* @param {Object} [options.gui.map={}] If undefined or false MapClient will create the map in a full page viewport
* @param {Object} [options.gui.layers={}] Map layers tree list
* @param {Object} [options.gui.baseLayers={}] Base layer switcher intended to be used as a floating control
* @param {Object} [options.gui.searchCoordinate] Simple coordinate search and pan control
* @param {Object} [options.gui.objectConfig] A generic form to configure feature attributes similar to a PropertyList
* @param {Object} [options.gui.zoomTools={}] Zoom slider and buttons intended to be used as a floating control
* @param {Object} [options.gui.searchFastighet={}] Search "fastighet" control
* @param {Object} [options.gui.showCoordinate] Simple control to show map coordinates
* @param [callback] optional callback to be run after Open eMap is initialized
* @return {OpenEMap.Client} reference to an initialized OpenEMap.Client object, or null if it wasnt possible to create it 
*/
var initOpenEMap = function(configPath, options, callback) {
	// Apply defaults to gui
	// Defaults to show map, toolbar, zoomTools, layers, baseLayers and search controls
	options.gui = options.gui || {};
	options.gui = {
		map : options.gui.map || {},
		toolbar : options.gui.toolbar || {},
		zoomTools : options.gui.zoomTools || {},
		layers : options.gui.layers || {},
		baseLayers : options.gui.baseLayers || {},
		searchFastighet : options.gui.searchFastighet || {}
	};

	var init = function(confPath) {
		var mapClient = Ext.create('OpenEMap.Client');

		var configure = function(config) {
			mapClient.destroy();
			var configClone = Ext.clone(config);
			mapClient.configure(configClone, options);
			var labels = new OpenLayers.Rule({
				filter : new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.EQUAL_TO,
					property : "type",
					value : "label"
				}),
				symbolizer : {
					pointRadius : 20,
					fillOpacity : 0,
					strokeOpacity : 0,
					label : "${label}"
				}
			});
			mapClient.drawLayer.styleMap.styles['default'].addRules([ labels ]);
		};
		
		if (confPath) {
			Ext.Ajax.request({
				url : confPath,
				method : 'GET',
				success : function(evt){
					configure(JSON.parse(evt.responseText));
				},
				failure: function(response, opts) {
					mapClient.destroy();
					throw 'Hittar inte konfigurationen';
				}
			});
		}
		
		return mapClient;
	};

	// Make sure OpenEMap is loaded
	var mapClient = waitUntilOpenEMapIsLoaded(init, configPath, options);
};