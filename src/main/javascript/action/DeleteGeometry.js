/**
 * Action to delete geometry
 * 
 * The snippet below is from configuration to MapClient.view.Map
 * 
 *      "tools" : [{
 *            "type": "DeleteGeometry",
 *            "tooltip": "Ta bort valt objekt/geometri"
 *        }]
 */
Ext.define('OpenEMap.action.DeleteGeometry', {
    extend: 'OpenEMap.action.Action',
    /**
     * @param config
     * @param {string} config.typeAttribute string to write to new feature attribute type
     */
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = mapPanel.drawLayer;
        
        config.handler = function() {
            layer.selectedFeatures.forEach(function(feature) {
                mapPanel.map.controls.forEach(function(control) {
                    if (control.CLASS_NAME == "OpenLayers.Control.ModifyFeature" && control.active) {
                        control.unselectFeature(feature);
                    }
                });
                layer.destroyFeatures([feature]);
            });
        };
        
        config.iconCls = config.iconCls || 'action-deletegeometry';
        config.tooltip = config.tooltip || 'Delete geometry';
        
        this.callParent(arguments);
    }
});
