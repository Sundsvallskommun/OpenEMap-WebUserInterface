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
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#666666",
                strokeDashstyle: "solid",
                fillColor: "#AFAFAF",
                fillOpacity: 0.4
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
        
        config.control = new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Polygon, {
            //persist: true,
            layerSegmentsOptions : null,
            layerLengthOptions : null,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        });

        config.iconCls = config.iconCls || 'action-measurearea';
        config.tooltip = config.tooltip || 'M&auml;t area';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
