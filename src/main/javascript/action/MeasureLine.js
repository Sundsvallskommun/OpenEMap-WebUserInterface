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
        
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#666666",
                strokeDashstyle: "solid"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
        
        config.control = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Path, {
            maxSegments : null,
            accuracy: 2,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        });        
        
        config.iconCls = config.iconCls || 'action-measureline';
        config.tooltip = config.tooltip || 'Mät str&auml;cka';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
