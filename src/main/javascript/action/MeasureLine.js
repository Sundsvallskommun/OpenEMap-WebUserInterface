/*    
    Copyright (C) 2014 Härnösands kommun

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
    // statics: {
        // measureWindow: null,
        // createMeasureWindow: function(renderTo) {
            // if (this.measureWindow) {
                // this.measureWindow.update('');
                // return;
            // }
            // this.measureWindow = Ext.create('Ext.window.Window', {
                // title: 'Mätresultat',
                // maximizable : false,
                // minimizable : false,
                // resizable: true,
                // y : 80,
                // x : 80,
                // width: 200,
                // height: 100,
                // autoScroll: true,
                // layout: 'fit',
                // collapsible: false,
                // //constrainHeader: true,
                // renderTo: renderTo ? renderTo.getEl() : undefined,
                // closeAction: 'hide'
            // });
        // }
    // },
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
            persist: true,
            maxSegments : null,
            accuracy: 2,
            //drawingLayer : mapClient.mapPanel.measureLayer,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        });
        
        var out = "";
        var count = 1;
        var reset = true;
        // function handleMeasurements(event) {
            // OpenEMap.action.MeasureLine.createMeasureWindow(mapPanel);
            // OpenEMap.action.MeasureLine.measureWindow.show();
//             
            // var geometry = event.geometry;
            // var units = event.units;
            // var order = event.order;
            // var measure = event.measure;
            // //var out = "";
            // if (reset) {
                // out = "";
                // count = 1;
                // reset = false;
            // }
            // var p1 = geometry.components[geometry.components.length-2];
            // var p2 = geometry.components[geometry.components.length-3];
            // if (p1 === undefined || p2 === undefined) return;
            // measure = p1.distanceTo(p2);
            // units = "m";
            // if(order == 1) {
                // out += "Delsträcka " + count + " : " + measure.toFixed(3) + " " + units + "<br>";
            // } else {
                // out += "Delsträcka " + count + " : " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>" + "<br>";
            // }
            // OpenEMap.action.MeasureLine.measureWindow.update(out);
            // count = count+1;
        // }
        
        function handleMeasurement(event) {
        	var v = new OpenLayers.Feature.Vector();
        	v.geometry = event.geometry;
        	mapPanel.measureLayer.addFeatures([v]);
            var measureSegmentLayer = mapPanel.map.layers.filter(function(l){return /labelSegment/.test(l.name);})[0];
            var lengthFeatures = measureSegmentLayer.features.map(function(l){
                return new OpenLayers.Feature.Vector(l.geometry.clone(), Ext.clone(l.attributes));
            });

            var lengthFeature = mapPanel.map.layers.filter(function(l){
                return /labelLength/.test(l.name);
            })[0].features;

            var length = new OpenLayers.Feature.Vector(lengthFeature[0].geometry.clone(), Ext.clone(lengthFeature[0].attributes));
            lengthFeatures.push(length);
            
            mapPanel.measureLayerSegmentsLayer.addFeatures(lengthFeatures);


        	
            // var units = event.units;
            // var order = event.order;
            // var measure = event.measure;
            // //var out = "";
            // if(order == 1) {
                // out += "Totalt: " + measure.toFixed(3) + " " + units + "<br>";
            // } else {
                // out += "Totalt: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>" + "<br>";
            // }
            // OpenEMap.action.MeasureLine.measureWindow.update(out);
            // reset = true;
        }
        
        config.control.events.on({
            'measure': handleMeasurement
            // 'measurepartial': handleMeasurements
        });
        
        config.iconCls = config.iconCls || 'action-measureline';
        config.tooltip = config.tooltip || 'Mät str&auml;cka';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
