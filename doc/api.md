
# Initialization

To initialize MapClient use the following call:

```javascript
MapClient.app.configure(config);
```

The argument 'config' is assumed to be a string containing [JSON configuration](config.md).

To reinitialize MapClient use the same as above but first use this call:

```javascript
MapClient.app.destroy();
```

# OpenLayers Map API

The OpenLayers Map instance is exposed as a property here:

```javascript
MapClient.app.map;
```

# Drawing layer vector overlay

A single drawing vector layer is used by editing tools and is exposed as a property here:

```javascript
MapClient.app.drawLayer;
```
