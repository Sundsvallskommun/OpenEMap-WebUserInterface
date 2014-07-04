/**
 * Action for delete all features in map
 */
Ext.define('OpenEMap.action.DeleteAllFeatures', {
    extend: 'OpenEMap.action.Action',
    
    constructor : function(config){
        
         config.control = new OpenLayers.Control.Button({
            trigger: function(){
                
                config.mapPanel.measureLayer.removeAllFeatures();
                config.mapPanel.measureLayerSegmentsLayer.removeAllFeatures();

                config.mapPanel.map.layers.forEach(function(l){
                    if(l instanceof OpenLayers.Layer.Vector){
                        l.removeAllFeatures();
                    }
                });
            }
        });

        config.iconCls = config.iconCls || 'action-deleteallfeatures';
        config.tooltip = config.tooltip || 'Rensa kartan fr&aring;n ritade objekt.';
        
        this.callParent(arguments);
    }
});