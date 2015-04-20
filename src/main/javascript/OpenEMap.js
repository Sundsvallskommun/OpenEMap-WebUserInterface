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

function loadJavaScriptSync(filePath, async)
{
    var req = new XMLHttpRequest();
    req.open("GET", filePath, async); // 'false': synchronous.
    req.send(null);

    var headElement = document.getElementsByTagName("head")[0];
    var newScriptElement = document.createElement("script");
    newScriptElement.type = "text/javascript";
    newScriptElement.text = req.responseText;
    headElement.appendChild(newScriptElement);
}


var loadJsScripts = function(files) {
	var head = document.getElementsByTagName("head")[0];
    for (var i = 0; i < files.length; i++) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
	 	script.src = files[i];
		head.appendChild(script);
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
		openEMapScriptLocation + "lib/ext/ext-all.js",
		openEMapScriptLocation + "lib/ext/ext-theme-neptune.js",
		openEMapScriptLocation + "lib/ext/locale/ext-lang-sv_SE.js",
		openEMapScriptLocation + "lib/OpenLayers/OpenLayers.js",
		openEMapScriptLocation + "lib/proj4js/proj4-compressed.js",
		openEMapScriptLocation + "proj4_defs.js",
		openEMapScriptLocation + "lib/geoext/geoext-all.js",
		openEMapScriptLocation + "lib/es5-shim/es5-shim.min.js",	
		openEMapScriptLocation + "OpenEMap-min.js"
    ];
	
	// Ensure css files are loaded before js files
	loadCssFiles(cssFiles, function() {
		loadJsScripts(scripts, false);
		waitUntilOpenEMapIsLoaded();
	});
}) ();

var waitUntilOpenEMapIsLoaded = function(callback) {
	if ((typeof OpenEMap === "undefined") || (typeof OpenEMap.Client === "undefined") || (typeof Ext === "undefined")) {
		setTimeout(function() { waitUntilOpenEMapIsLoaded(callback); }, 5);
	} else {
		callback();
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
* @return {OpenEMap.Client} reference to an initialized OpenEMap.Client object, or null if it wasnt possible to create it 
*/
var initOpenEMap = function(configPath, options) {
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

	var init = function() {
		var mapClient = Ext.create('OpenEMap.Client');
		
		Ext.Ajax.request({
			url : configPath,
			method : 'GET',
			success : function(evt){
				var config = JSON.parse(evt.responseText);
				mapClient.configure(Ext.clone(config), options);
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
				return mapClient;
			},
			failure: function(response, opts) {
				mapClient.destroy();
				throw 'Hittar inte konfigurationen';
			}
		});
	};

	// check configPath
	if (configPath) {
		// Make sure OpenEMap is loaded
		waitUntilOpenEMapIsLoaded(init);
	
	} else {
		throw 'Hittar inte konfigurationen';
	} 
};