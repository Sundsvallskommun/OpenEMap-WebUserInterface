# MapClient integration configuration
## Options object reference 
Complete reference for possible settings for options when creating client object
```json
"options" : {
	"gui" : {
		"map" : { // Set to false to make map create its own div, otherwise renderTo must be specified
			"renderTo" : "divToRenderTo" // Optional
		},
		"toolbar" : { // Optional. Use to show toolbar
			"renderTo" : "divToRenderTo" // Optional
		},
		"zoomTools" : { // Optional. Use to show zoomTools
			"renderTo" : "divToRenderTo" // Optional
		},
		"layers" : { // Optional. Use to show layers control
			"renderTo" : "divToRenderTo", // Optional
			"type": "basic", // basic, listconfigs or advanced, description below  
			"legendDelay": 0 // specifies how long time in millisecond the legend image popup will show before it hides. Default is 5000. Set to 0 to make it stay until user closes it  
		},
		"baseLayers" : { // Optional. Use to show baseLayers control
					"renderTo" : "divToRenderTo" // Optional
		},
		"searchFastighet" : { // Optional. Use to show search control
			"renderTo" : "divToRenderTo" // Optional
		},
		"searchCoordinate": { // Optional. Use to show search coordinate control
			"renderTo": "searchcoordinate"}, // Required
		"scalebar" : { // Optional. Use to show scalebar
			"renderTo" : "divToRenderTo" // Optional
		},
		"showCoordinate": { // Optional. Use to show coordinates for mouse pointer
			"renderTo": "showcoordinate" // required
		}
	},
	"OpenEMap" : { // Global constants to set where to find different services and resources 
		"basePathImages" : "../resources/images/",
		"basePathMapFish" : "/mapfishprint-2.1.1/pdf", // Base path to be used for mapfish print servlet requests
		"basePathLM" : "/search/lm/", // Base path to be used for all AJAX requests against search-lm REST API
		"lmUser" : "sundsvall", // name of user to be used when calling search-lm REST API
		"basePathES" : "/search/es/", // Base path to be used for all AJAX requests against Elasticsearch REST API
		"wmsURLs" : { // URL/paths related to WMS usage / advanced layer list
			"basePath" : "/geoserver/wms", // URL to be used to fetch WMS capabilities etc. for add layer
			"url" : "https://extmaptest.sundsvall.se/geoserver/wms", // URL to be used when WMS layer has been added to config
			"getCapabilities" : "https://extmaptest.sundsvall.se/getcapabilities/wms.xml" // URL to getcapabilities document. Must include request parameter (eg. https://extmap.sundsvall.se/geoserver/wms?request=GetCapabilities&version=1.1.1)
		},
		"basePathProxy" : "/cgi-bin/proxy.py?url=", //Base path to proxy to be used for WFS-post
		"wsUrls" : { // WS paths to be used for AJAX requests
			"basePath" : "/openemapadmin", //basepath to Open eMap Admin
			"configs" : "/configs", // relative path to configs, set in admin of modules in OpenHierarchy
			"adminconfigs" : "/adminconfigs", // relative path to adminconfigs, set in admin of modules in OpenHierarchy
			"permalinks"" : "/openemappermalink/permalinks", // path to permalinks
			"metadata" : "geometadata/getmetadatabyid",
			"metadata_abstract" : "geometadata/getabstractbyid"
		}
	}
};

## Layers control
Details for the layers control
### basic
Shows a basic layers control without possibility to add layers or saving config
### listconfigs
Shows the layers control including list of my maps and public maps, and the possibility to save map, but without add layer control 
### advanced
Shows the layers control including all functionality including list of my maps and public maps, possibility to save map, and add layer control 
