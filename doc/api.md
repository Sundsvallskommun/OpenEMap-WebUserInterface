
# Initialization

To initialize MapClient use the following call:

```javascript
mapClient.app.configure(config);
```

The argument 'config' is assumed to be a string containing [JSON configuration](config.md).

To reinitialize MapClient use the same as above but first use this call:

```javascript
mapClient.app.destroy();
```

# OpenLayers Map API

The OpenLayers Map instance is exposed as a property here:

```javascript
mapClient.app.map;
```

# Drawing layer vector overlay

A single drawing vector layer is used by editing tools and is exposed as a property here:

```javascript
mapClient.app.drawLayer;
```

# Adding Popup layer vector overlay

A popup layer is considered to be used if the integration environment wants to publish vector data on top of the map, like Points of interrest. The features supports clicking to select them using the Popup action, or manually calling the showPopupFeature method. They also support stylemaps in OpenLayers to set rendering styles for default and selection.

The vector data is supposed to be in GeoJSON format and must include a attribute holding a unique id and another attribute containing the text that should be shown in a popup window when selecting the feature. The text can be formatted as HTML.

Snippet for adding a popuplayer to map:
```javascript
var popupLayer = mapClient.addPopupLayer(geojson, 'Popup layer example', 'id', 'popupText', 'Prefix', '<a href="javascript:alert(\'Suffix link!\');">Suffix</a>', 'popupTitle', stylemapGraphics, 'EPSG:3006', true);
```
For details see the [PopupLayer example](../examples/popupLayer.html)

