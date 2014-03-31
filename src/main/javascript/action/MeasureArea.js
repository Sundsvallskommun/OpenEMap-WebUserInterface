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
                strokeColor: "#2969db",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#2969db",
                strokeDashstyle: "dash",
                fillColor: "#deecff",
                fillOpacity: 0.4
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
        
        config.control = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
            persist: true,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        });
        
        var out = "";
        var count = 1;
        var reset = true;
        function handleMeasurements(event) {
            OpenEMap.action.MeasureLine.createMeasureWindow(mapPanel);
            OpenEMap.action.MeasureLine.measureWindow.show();
            
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            //var out = "";
            if (reset) {
                out = "";
                count = 1;
                reset = false;
            }
            var p1 = geometry.components[geometry.components.length-2];
            var p2 = geometry.components[geometry.components.length-3];
            if (p1 === undefined || p2 === undefined) return;
            measure = p1.distanceTo(p2);
            units = "m";
            if(order == 1) {
                out += "Delsträcka " + count + " : " + measure.toFixed(3) + " " + units + "<br>";
            } else {
                out += "Delsträcka " + count + " : " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>" + "<br>";
            }
            OpenEMap.action.MeasureLine.measureWindow.update(out);
            count = count+1;
        }
        
        function handleMeasurement(event) {
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            //var out = "";
            if(order == 1) {
                out += "Totalt: " + measure.toFixed(3) + " " + units + "<br>";
            } else {
                out += "Totalt: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>" + "<br>";
            }
            OpenEMap.action.MeasureLine.measureWindow.update(out);
            reset = true;
        }
        
        config.control.events.on({
            'measure': handleMeasurement,
            'measurepartial': handleMeasurements
        });
        
        config.iconCls = config.iconCls || 'action-measurearea';
        config.tooltip = config.tooltip || 'M&auml;t area';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
