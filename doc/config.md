
# MapClient configuration
## Base tags on the highest level of the configuration file
Example of a complete config file [testAll.json](testAll.json)
```json
{
	"configId": idOfTheConfig,
	"name": "nameOfTheConfig",
	"version": ?,
	"maxExtent": [
		westing,
		southing,
		easting,
		northing
	],
	"extent": [ 'initial extent
		westing,
		southing,
		easting,
		northing
	],
	"autoClearDrawLayer": whetherToDeleteExistingObjectWhenANewObjectIsDrawn, 
	"attribution": "attributionToBeShownInMap",
	"drawStyle": OpenLayers.StyleUsedForDrawLayer,
	"resolutions": [ ' list of resolutions to be used in map
			resolutionN,
			resolution3,
			resolution2,
			resolution1,
			resolution0
		],
	"units": "unitsToUseInMap",
	"projection": "epsgCodeForMapProjection",
	"username": "nameOfUserCreatingMap",
	"isPublic": "wheterOrNotTheConfigIsPublic",
	"hasListeners": ?,
	"events": ?,
	"options": ?,
	"layers": {layerObject}, ' Layers available in map. See details below
	"tools": {toolsObject}, ' Tools available in map. See details below
	"search": {searchObject} ' Searches that can be made in app. See details below
}
```

## Specifying layers included in map. 
A layer can include a WMS-specifgication and a WFS-specification. WMS are used to draw layers in the map, WFS is used to get information on features in a layer.
```json
"layers": [
	"name": "nameOfTheLayer",
	"queryable": whetherTheLayerServiceIsQueryable,
	"clickable": whetherTheLayerShouldBeClickableInMap,
	"isGrouplayer": whetherTheLayerIsAGrouplayer,
	"wms": {
		"url": "urlToWMSService",
		"metadataUrl": "urlToMetadataService",
		"params" : {
			"layers": "wmsLayerNames",
			"format": "imageFormat",
			"exceptions": "exceptionHandling",
			"version": "wmsVersionToUse",
			"transparent": whetherToUseTransparancy,
			"styles": "stylesToUseForEachWMSLayer"
		},
		"options": {
			"isBaseLayer": whetherTheLayerIsConsideredToBeABaseLayer,
			"displayInLayerSwitcher": whetherToShowTheLayerInLayerSwitcher,
			"visibility": whetherToShowLayerAtStartup,
			"legendURL": "http://domainname/legend.png"
		}
	}
	"wfs": {
		"url": "baseUrlToWFSService",
		"featureType": "featureTypeWithoutPrefix",
		"featurePrefix": "featurePrefix"
	}
	"metadata": {
		"attributes": {
			"attributeName": {
				"alias": "attributeAlias"
			}
		}
	}
]
```
## Grouplayers expanded/collapsed
```json
"layers": [
    "expanded": whetherTheGroupLayerShouldBeExpanded,
    "isGrouplayer": whetherLayerIsAGroupLayer, 'Always true for group layers
    "options": {
    	"visibility": whetherTheGroupLayerShouldBeVisibleOrNot
    }
]
```
## Specify search settings. 
Excluding a searchtag (search.searchEstates, search.searchAddresses, search.searchPlacenames, search.searchES.detaljplan) will make it disappear in the drop down list of available searches. If no search string is specified, the search gui will disappear completely.
```json
    "search": {
        "searchEstates": {
            "options": {
                "municipalities": [
                    "Nordanstig",
                    "Sundsvall",
                    "Timrå",
                    "Härnösand",
                    "Kramfors"
                ]
            }
        },
        "searchAddresses": {
            "options": {
                "municipalities": [
                    "Nordanstig",
                    "Sundsvall",
                    "Timrå",
                    "Härnösand",
                    "Kramfors"
                ],
		"zoom": 1
            }
        },
        "searchPlacenames": {
            "options": {
                "municipalities": [
                    "2132",
                    "2281",
                    "2262",
                    "2280",
                    "2282"
                ],
		"zoom": 1
            }
        },
        "searchES": {
        	"detaljplan": true
        }
    }

```
## Specifying tools included in map
```json
    "tools": [
    	{' Zoom to full extent
            "id": "FullExtent", 
            "type": "FullExtent" 
        },
        {' Show drop down with possibility to zoom to scales
            "id": "ZoomSelector",
            "type": "ZoomSelector" 
	},
        {' Print dialog
            "id": "Print", 
            "type": "Print"
        },
        {' Identify features in map
            "id": "Identify", 
            "type": "Identify", 
	    "onlyVisibleLayers": whetherOrNotToIdentifyLayersNotShownInMap, ' defaults to true
            "useRegisterenhet": whetherOrNotToUseRegisterenhet, ' turns on identifying real estate parcels
            "tolerance": toleranceInPixels ' defaults to radius 3 pixels
	},
        {' Show popup for features in "popupLayers"
            "id": "Popup", 
            "type": "Popup", 
        	"showOnlyFirstHit": whetherToShowOneOrManyHits, ' defaults to true
            "tolerance": toleranceInPixels ' defaults to radius 3 pixels
	},
        {' Show popup with permalink to share map
            "id": "Permalink", 
            "type": "Permalink" 
        },
       	{ ' Meassure lengths
       	    "id": "MeasureLine",
       		"type": "MeasureLine", 
       		"accuracy": AccuracyOfMeasurements 
       	}, 
       	{ ' Meassure areas
       		"id": "MeasureArea",
       		"type": "MeasureArea", 
       		"accuracy": AccuracyOfMeasurements 
       	}, 
       	{' deletes all meassures in map
        	"id": "DeleteMeasure", 
        	"type": "DeleteMeasure"
        },
        { ' Draw polygons on map
            "id": "DrawPolygon",
            "type": "DrawGeometry",
            "iconCls": "action-drawpolygon",
            "geometry": "Polygon"
        },
        { ' Draw lines on map
            "id": "DrawLine",
            "type": "DrawGeometry",
            "iconCls": "action-drawline",
            "geometry": "Path"
        },
        { ' Draw points on map
            "id": "DrawPoint",
            "type": "DrawGeometry",
            "iconCls": "action-drawpoint",
            "geometry": "Point"
        },
        { ' Draw label on map
            "id": "DrawText",
            "type": "DrawGeometry",
            "tooltip": "Rita etikett",
            "iconCls": "action-drawpoint",
            "geometry": "Point",
            "attributes": {
                "type": "label",
                "label": "Ny label",
                "metadata": {
                    "type": {
                        "hidden": true
                    }
                }
            }
        },
        { ' Draw rectangular object on map
            "id": "DrawRectangle",
            "itemId": "DrawObjectR",
            "type": "DrawObject",
            "objectConfig": {
                "type": "R"
            },
            "tooltip": "Rita byggnad Rektangel",
            "iconCls": "action-draw-R",
            "disabled": false,
            "attributes": {
                "state": "GEOMETRY",
                "metadata": {
                    "state": {
                        "hidden": false
                    }
                }
            }
        },
        { ' Draw octagonal object
            "id": "DrawOctagon",
            "itemId": "DrawObjectO",
            "type": "DrawObject",
            "objectConfig": {
                "type": "O"
            },
            "tooltip": "Rita byggnad Oktagon",
            "iconCls": "action-draw-O",
            "disabled": false,
            "attributes": {
                "state": "GEOMETRY",
                "metadata": {
                    "state": {
                        "hidden": false
                    }
                }
            }
        },
        { ' Draw L-shaped object
            "id": "DrawL-shape",
            "itemId": "DrawObjectL",
            "type": "DrawObject",
            "objectConfig": {
                "type": "L"
            },
            "tooltip": "Rita byggnad L-form",
            "iconCls": "action-draw-L",
            "disabled": false,
            "attributes": {
                "state": "GEOMETRY",
                "metadata": {
                    "state": {
                        "hidden": false
                    }
                }
            }
        },
        { Draw D-shaped object
            "id": "DrawD-shape",
            "itemId": "DrawObjectD",
            "type": "DrawObject",
            "objectConfig": {
                "type": "D"
            },
            "tooltip": "Rita byggnad avfasad",
            "iconCls": "action-draw-D",
            "disabled": false,
            "attributes": {
                "state": "GEOMETRY",
                "metadata": {
                    "state": {
                        "hidden": false
                    }
                }
            }
        },
        {' Modify drawn geometries
        	"id": "ModifyGeometry",
        	"type": "ModifyGeometry"
        },
        { ' Selects drawn geometries
        	"id": "SelectGeometry", 
        	"type": "SelectGeometry"
        },
        {' Delete selected geometry
        	"id": "DeleteGeometry", 
        	"type": "DeleteGeometry"
        },
        { ' Deletes all drawn geometries
            "id": "DeleteAllFeatures"
            "type": "DeleteAllFeatures"
        },
        { ' Shows a detailed report for a specified point
            "id": "DetailReport"
            "type": "DetailReport"
        }
    ]
```
