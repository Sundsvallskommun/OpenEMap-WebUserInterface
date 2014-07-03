/**
 * Action for delete measurements
 */
Ext.define('OpenEMap.action.DeleteMeasure', {
    extend: 'OpenEMap.action.Action',
    
    constructor : function(config){
        
         config.control = new OpenLayers.Control.Button({
            trigger: function(){
            
                config.mapPanel.measureLayer.removeAllFeatures();
                config.mapPanel.measureLayerArea.removeAllFeatures();
                config.mapPanel.measureLayerLength.removeAllFeatures();
                config.mapPanel.measureLayerSegments.removeAllFeatures();

                config.mapPanel.map.controls.forEach(function(c){
                    if(c instanceof OpenLayers.Control.DynamicMeasure){
                        c.deactivate();
                    }
                });
            }
        });

        config.iconCls = config.iconCls || 'action-deletegeometry';
        config.tooltip = config.tooltip || 'Ta bort m&auml;tning(ar).';
        
        this.callParent(arguments);
    }
});
