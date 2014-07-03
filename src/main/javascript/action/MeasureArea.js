/**
 * Action that measure area.
 *{@img Measurearea.png measurearea}
 * 
 * The example below is from configuration adding the tool to MapClient.view.Map:
 * 
 *         "tools": [ "FullExtent", "ZoomSelector", "MeasureLine", "MeasureArea"]
 */
Ext.define('OpenEMap.action.MeasureArea', {
    extend: 'OpenEMap.action.Action',
    
    constructor: function(config) {
        
        var mapPanel = config.mapPanel;
        
        config.control = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Polygon, {
            mapPanel: mapPanel
        });

        config.iconCls = config.iconCls || 'action-measurearea';
        config.tooltip = config.tooltip || 'M&auml;t area';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
