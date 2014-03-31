/**
 * Action in toolbar that zooms the user to full extent
 * 
 * The snippet below is from configuration to MapClient.view.Map
 * 
 * {@img Fullextent.png fullextent}
 * 
 *        "tools": ["FullExtent"]
 */
Ext.define('OpenEMap.action.FullExtent', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        config.control = new OpenLayers.Control.ZoomToMaxExtent();
        
        config.iconCls = config.iconCls || 'action-fullextent';
        config.tooltip = config.tooltip || 'Zooma till full utberedning';
        
        this.callParent(arguments);
    }
});
