# MapClient GUI configuration
The GUI can be configured using a json-object with following possible settings:
```json
"options": {
	"gui": {
		"map":{' If undefined or false MapClient will create the map in a full page viewport
			"renderTo": "divId" ' optional div-id to render map to
		}, 
		"zoomTools": {'Zoom slider and buttons intended to be used as a floating control
			"renderTo": "divId" ' optional div-id to render control to
		},
		"layers": { 'Creates a layer control if specified
			"renderTo": "divId", ' optional div-id to render control to
     		"type": "typeOfLayerControl" ' Possible values are "basic" and "advanced". defaults to "basic" 

     	},
   		"baseLayers": {'Base layer switcher intended to be used as a floating control
			"renderTo": "divId" ' optional div-id to render control to
     	}, 
        "toolbar": { ' Control to show toolbar
			"renderTo": "divId" ' optional div-id to render control to
        };
		"searchFastighet": {'Search "fastighet" control
			"renderTo": "divId" ' optional div-id to render control to
		},
		"searchCoordinate": {' Simple coordinate search and pan control
			"renderTo": "divId" ' optional div-id to render control to
		},
		"objectConfig": { 'A generic form to configure feature attributes similar to a PropertyList
			"renderTo": "divId" ' optional div-id to render control to
		},
		"showCoordinate": {' Simple control to show map coordinates
			"renderTo": "divId" ' must be specified, cause the container has no deafult location for rendering
		}, 
        "scalebar": { ' Simple control to show scalebar
			"renderTo": "divId" ' optional div-id to render control to
        }
	}
}
```
