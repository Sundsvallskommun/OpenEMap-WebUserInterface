/**
 * Action that modify geometry
 * 
 * Example configuration using experimental support in OL to customize drag and radius handles:
 *    {
 *      "type": "ModifyGeometry",
 *      "reshape": true,
 *      "tooltip": "Redigera geometri",
 *      "options": {
 *        "dragHandleStyle": {
 *          "pointRadius": 8,
 *          "externalGraphic": "css/images/arrow-move.png",
 *          "fillOpacity": 1
 *        },
 *        "radiusHandleStyle": {
 *          "pointRadius": 8,
 *          "externalGraphic": "css/images/arrow-circle.png",
 *          "fillOpacity": 1
 *        }
 *      }
 *    } 
 *    
 * @param {boolean} config.drag Allow dragging of features
 * @param {boolean} config.rotate Allow rotation of features
 * @param {boolean} config.resize Allow resizing of features
 * @param {boolean} config.reshape Allow reshaping of features
 * @param {Object} config.options Additional options to send to OpenLayers.Control.ModifyFeature
 */
Ext.define('OpenEMap.action.ModifyGeometry', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = mapPanel.drawLayer;
        
        if (config.drag === undefined) config.drag = true;
        if (config.rotate === undefined) config.rotate = true;
        if (config.reshape === undefined) config.reshape = true;
        
        var mode = 0;
        if (config.drag) mode = mode | OpenLayers.Control.ModifyFeature.DRAG;
        if (config.rotate) mode = mode | OpenLayers.Control.ModifyFeature.ROTATE;
        if (config.resize) mode = mode | OpenLayers.Control.ModifyFeature.RESIZE;
        if (config.reshape) mode = mode | OpenLayers.Control.ModifyFeature.RESHAPE;
        
        var options = Ext.apply({mode: mode}, config.options);
        config.control = new OpenLayers.Control.ModifyFeature(layer, options);
        config.control._mode = config.control.mode;
        
        config.iconCls = config.iconCls || 'action-modifygeometry';
        config.tooltip = config.tooltip || '&Auml;ndra ritat objekt';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
