/**
 * Action for delete measurements
 */
Ext.define('OpenEMap.action.DeleteMeasure', {
    extend: 'OpenEMap.action.Action',
    
    constructor : function(config){
        
         config.control = new OpenLayers.Control.Button({
            trigger: function(){
                
                mapClient.mapPanel.measureLayer.removeAllFeatures();
                mapClient.mapPanel.measureLayerSegmentsLayer.removeAllFeatures();

                mapClient.mapPanel.map.layers.forEach(function(l){
                    if(l instanceof OpenLayers.Layer.Vector){
                        // To do clean up
                        if (/OpenLayers.Control.DynamicMeasure/.test(l.name)){
                            l.removeAllFeatures();
                        } else if (/Measure\i/.test(l.name)){
                            l.removeAllFeatures();
                        } else if (l.name === 'OpenLayers.Handler.Path'){
                            l.removeAllFeatures();
                        }
                    }
                });
            }
        });

        config.iconCls = config.iconCls || 'action-deletegeometry';
        config.tooltip = config.tooltip || 'Ta bort m&auml;tning(ar).';
        
        this.callParent(arguments);
    }
});