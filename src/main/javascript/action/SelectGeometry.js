/**
 * Action that selelcts geometry.
 */
Ext.define('OpenEMap.action.SelectGeometry', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        
        config.control = mapPanel.selectControl;
        
        config.iconCls = config.iconCls || 'action-selectgeometry';
        config.tooltip = config.tooltip || 'Select geometry';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
