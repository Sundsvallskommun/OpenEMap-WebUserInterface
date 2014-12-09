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
    <script type="text/javascript" src="/libs/proj4js/proj4-compressed.js"></script>
    <script type="text/javascript" src="/libs/proj4js/proj4_defs.js"></script>
    <script type="text/javascript" src="/libs/geoext-2.0.1-oemap-all.js"></script> <!-- OEMap specific build of geoext2, correcting problem with borderwidth for popup window. --> 
    <script type="text/javascript" src="/libs/es5-shim.min.js"></script>
    <script type="text/javascript" src="OpenEMap-all.js"></script>
    
    <script type="text/javascript">
	var mapClient = null;
	Ext.onReady(function() {
		mapClient = Ext.create('OpenEMap.Client');
   		mapClient.destroy();
		mapClient.configure(config);
	}
    </script>
    
	<div id="toolbar"></div>
	<div id="map" style="position: absolute; left: 120px; width: 100%; height: 650px" class="popup"></div>
	<div id="layers"></div>
	<div id="searchfastighet"></div>
	<div id="searchcoordinate"></div>
	<div id="objectconfig"></div>
```

NOTE: The above snippet assumes the use of release build including all dependencies. For sample build script see build directory.

NOTE: Uses theme [SundsvallsKommun/ext-theme-oep](https://github.com/Sundsvallskommun/ext-theme-oep) for rendering

NOTE: es5-shim.min.js is required for IE 8 compatibility only

##Homepage
<a href="http://oemap.org"><img alt="Open eMap homepage" src="http://oemap.org/images/logo.png" width="200"></a>

## Documentation
###API Docs 
####[1.3.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.3.0/)
####[1.2.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.2.0/)
####[1.1.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.1.0/)

## Development

Assumed external dependencies:
 * Ext JS 4.2.1 in folder /libs/ext-4.2.1
 * GeoExt 2 in folder /libs/
 * OpenLayers 2.13 in folder /libs/OpenLayers-2.13.1
 * ext-theme-oep in folder /libs/ext-theme-oep - ext theme for Open ePlatform and Open eMap, se repository [SundsvallsKommun/ext-theme-oep](https://github.com/Sundsvallskommun/ext-theme-oep)
 * proj4js in folder /libs/proj4js - support for coordinate system transformation 

## Versioning

Versioning should follow [Semantic versioning 2.00](http://semver.org/)
This semantic starts at version 1.1.0-rc.1 (MAJOR.MINOR.PATCH-PRERELEASE)
Versioning uses the GitFlow model. Release branches are created as soon as a feature freeze is decided, and should be created for each new version with status of MAJOR, MINOR or PATCH. Pre releases are made within their respective release branch.

## License

Open eMap Web User Interface is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.html) for more details.
