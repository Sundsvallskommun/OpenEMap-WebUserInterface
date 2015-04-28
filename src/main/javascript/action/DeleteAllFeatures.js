/**
 * Action for delete all features in map
 */
Ext.define('OpenEMap.action.DeleteAllFeatures', {
    extend: 'OpenEMap.action.Action',
    
    constructor : function(config){
        
         config.control = new OpenLayers.Control.Button({
            trigger: function() {
                config.mapPanel.drawLayer.removeAllFeatures();
            }
        });

        config.iconCls = config.iconCls || 'action-deleteallfeatures';
        config.tooltip = config.tooltip || 'Rensa kartan fr&aring;n ritade objekt.';
        
        this.callParent(arguments);
    }
});