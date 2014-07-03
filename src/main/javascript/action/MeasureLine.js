/**
 * Action that measure line.
 * {@img Measureline.png measureline}
 * 
 * The example below is from configuration:
 * 
* The example below is from configuration adding the tool to MapClient.view.Map:
 * 
 *         "tools": [ "FullExtent", "ZoomSelector", "MeasureLine", "MeasureArea"]
 */
 
Ext.define('OpenEMap.action.MeasureLine', {
    extend: 'OpenEMap.action.Action',
    
    constructor: function(config) {
        
        var mapPanel = config.mapPanel;

        config.control = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Path, {
            maxSegments : null,
            accuracy: 2,
            mapPanel: mapPanel
        });        
        
        config.iconCls = config.iconCls || 'action-measureline';
        config.tooltip = config.tooltip || 'Mät str&auml;cka';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
