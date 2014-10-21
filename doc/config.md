
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
	"autoClearDrawLayer": ?,
	"attribution": "attributionToBeShownInMap",
	"drawStyle": ?,
	"resolutions": [ ' list of resolutions to be used in map
			resolutionN,
			resolution3,
			resolution2,
			resolution1,
			resolution0
		],
	"units": "unitsToUseInMap",
	"projection": "epsgCodeForMapProjection",
	"username": ?,
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
		"attributes" {
			"": "attributeName" {
				"alias": "attributeAlias"
			}
		}
	}
]
```
## Grouplayers expanded/collapsed
```json
"layers": [
    "expanded": false
]
```
## Specify search settings
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
        }
    }

```
## Specifying tools included in map
```json
    "tools": [
        "FullExtent", ' Zoom to full extent
        "Print", ' Print dialog
        {
            "type": "Identify", ' Identify features in map
            "useRegisterenhet": whetherOrNotToUseRegisterenhet, ' turns on identifying real estate parcels
            "tolerance": toleranceInPixels ' defaults to radius 3 pixels
		},
       	{ ' Meassure lengths
       		"type": "MeasureLine", 
       		"accuracy": "AccuracyOfMeasurements" 
       	}, 
       	{ ' Meassure areas
       		"type": "MeasureArea", 
       		"accuracy": "AccuracyOfMeasurements" 
       	}, 
        "DeleteMeasure", ' deletes all meassures in map
        { ' Draw polygons on map
            "type": "DrawGeometry",
            "iconCls": "action-drawpolygon",
            "geometry": "Polygon"
        },
        { ' Draw lines on map
            "type": "DrawGeometry",
            "iconCls": "action-drawline",
            "geometry": "Path"
        },
        { ' Draw points on map
            "type": "DrawGeometry",
            "iconCls": "action-drawpoint",
            "geometry": "Point"
        },
        { ' Draw label on map
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
        "ModifyGeometry", ' Modify drawn geometries
        "SelectGeometry", ' Selects drawn geometries
        "DeleteGeometry", ' Delete selected geometry
        { ' Deletes all drawn geometries
            "type": "DeleteAllFeatures"
        },
        { ' Shows a detailed report for a specified point
            "type": "DetailReport"
        }
    ]
```
