# OpenEMap-WebUserInterface (map-client)

Configurable map viewer

Based on Ext JS 4 and GeoExt 2

Ext JS application name is MapClient

## Integration

Integrate into HTML page using the following snippet:

```html
    <link rel="stylesheet" type="text/css" href="ext-4.2.1/resources/css/ext-all-oep.css">
    <script type="text/javascript" src="ext-4.2.1/ext-all.js"></script>
    <script type="text/javascript" src="ext-4.2.1/ext-theme-oep.js"></script>
    <script type="text/javascript" src="ext-4.2.1/locale/ext-lang-sv_SE.js"></script>
    <script type="text/javascript" src="OpenLayers-2.13.1/OpenLayers.js"></script>
    <script type="text/javascript" src="geoext2-all.js"></script> 
    <link rel="stylesheet" type="text/css" href="css/map-client.css">
    <script type="text/javascript" src="es5-shim.min.js"></script>
    <script type="text/javascript" src="map-client-all.js"></script>
```

NOTE: The above snippet assumes the use of release build including all dependencies

NOTE: es5-shim is required for IE 8 compatibility only

[API Docs old location](http://sweco.github.io/6603517000-riges/map-client/master/docs)

## Development

Assumed external dependencies:
 * Ext JS 4.2.1 in folder ext-4.2.1
 * GeoExt 2 master branch in folder GeoExt
 * OpenLayers 2.13 in folder OpenLayers-2.13

