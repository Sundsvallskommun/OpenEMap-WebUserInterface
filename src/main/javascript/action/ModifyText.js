/**
 * Action that selelcts geometry.
 */
Ext.define('OpenEMap.action.ModifyText', {
    extend: 'OpenEMap.action.Action',

    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var layer = config.mapPanel.drawLayer;

        config.attributes = config.attributes || {};
        
        config.control = config.mapPanel.selectControl;

        config.control.events.register('deactivate', this, function(){
        	console.log('deactivate');
        	
        });

        config.control.events.register('activate', this, function(){
            var self = this;
            layer.events.register('featureselected', self, function(evt){
                Ext.Msg.prompt('Text', 'Mata in text:', function(btn, text){
                    if (btn == 'ok'){
                        evt.feature.attributes.label = text;
                        evt.feature.data.label = text;
                        layer.redraw();
                    }
                });
            });
        });

        config.control.events.register('deactivate', this, function(){
            layer.events.unregister('featureselected');
                
        });

        config.iconCls = config.iconCls || 'action-selectgeometry';
        config.tooltip = config.tooltip || '&Auml;ndra text';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    }
});
