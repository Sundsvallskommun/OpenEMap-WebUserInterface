<a href="http://oemap.org"><img alt="Open eMap homepage" src="http://oemap.org/img/logotyp.png"></a>
# OpenEMap-WebUserInterface (map-client)

Configurable map viewer

Based on Ext JS 4, GeoExt 2 and OpenLayers 2.13.1

Ext JS application name is MapClient

## Integration

Integrate into HTML page using the following snippet:

```html
    <link rel="stylesheet" type="text/css" href="/libs/ext-theme-oep/oepTheme-all.css">
    <link rel="stylesheet" type="text/css" href="resources/css/OpenEMap.css">  
    <script type="text/javascript" src="/libs/ext-4.2.1/ext-all.js"></script>
    <script type="text/javascript" src="/libs/ext-4.2.1/ext-theme-neptune.js"></script>
    <script type="text/javascript" src="/libs/ext-4.2.1/locale/ext-lang-sv_SE.js"></script>
    <script type="text/javascript" src="/libs/OpenLayers-2.13.1/OpenLayers.js"></script>
    <script type="text/javascript" src="/libs/geoext2-all.js"></script> 
    <script type="text/javascript" src="/libs/es5-shim.min.js"></script>
    <script type="text/javascript" src="OpenEMap-all.js"></script>
```

NOTE: The above snippet assumes the use of release build including all dependencies

NOTE: es5-shim is required for IE 8 compatibility only

##Homepage
<a href="http://oemap.org"><img alt="Open eMap homepage" src="http://oemap.org/img/logotyp.png" width="200"></a>

## Documentation
###API Docs 
####[1.1.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.1.0/)
####[1.2.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.2.0/)

## Development

Assumed external dependencies:
 * Ext JS 4.2.1 in folder /libs/ext-4.2.1
 * GeoExt 2 in folder /libs/
 * OpenLayers 2.13 in folder /libs/OpenLayers-2.13.1
 * ext-theme-oep in folder /libs/ext-theme-oep - ext theme for Open ePlatform and Open eMap, se repository [SundsvallsKommun/ext-theme-oep](https://github.com/Sundsvallskommun/ext-theme-oep)

## Versioning

Versioning should follow [Semantic versioning 2.00](http://semver.org/)
This semantic starts at version 1.1.0-rc.1 (MAJOR.MINOR.PATCH-PRERELEASE)
Versioning uses the GitFlow model. Release branches are created as soon as a feature freeze is decided, and should be created for each new version with status of MAJOR, MINOR or PATCH. Pre releases are made within their respective release branch.

