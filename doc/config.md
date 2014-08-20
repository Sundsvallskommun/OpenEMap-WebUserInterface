
# MapClient configuration
## Base tags on the highest level of the configuration file
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
	"units": "unitsToUseInMap"
	"projection": "epsgCodeForMapProjection"
	"username": ?,
	"hasListeners": ?,
	"events": ?,
	"options": ?,
	"layers": {layerObject}, ' List of layers in map. See details below
	"tools": {toolsObject} ' List of tools in map. See details below
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
			"visibility": whetherToShowLayerAtStartup
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
## Specify zoom level for search Adress and Ortnamn
```json
"search" : {
	"searchAddresses" : {
		"options" : {
			"zoom": 1
		}
	},
	"searchPlacenames" :{
		"options" : {
			"zoom": 1
		}
	}
}
```
## Delete all features
```json
"tools": {
	"DeleteAllFeatures"
}
```
## Grouplayers expanded/collapsed
```json
"layers": [
    "expanded": false
]
```
