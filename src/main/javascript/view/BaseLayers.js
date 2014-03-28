/**
 * Custom floating panel to switch baselayers
 */
Ext.define('OpenEMap.view.BaseLayers', {
    extend : 'Ext.toolbar.Toolbar',
    border: false,
    cls: 'oep-map-tools',
    constructor : function(config){
        var mapPanel = config.mapPanel;
        var map = mapPanel.map;
        
        var baseLayers = mapPanel.map.layers.filter(function(layer) { return layer.isBaseLayer; });
        
        var createButton = function(layer){
            var cls;
            
            if (layer == baseLayers[baseLayers.length-1]) cls = 'oep-tools-last';
            
            var button = Ext.create('Ext.Button', {
                text : layer.name,
                toggleGroup : 'baseLayers',
                allowDepress: false,
                layer: layer,
                pressed : layer.visibility,
                cls: cls,
                listeners : {
                    toggle : function(btn, pressed, opts){
                        if (pressed) map.setBaseLayer(layer);
                    }
                }
            });

            return button;
        };
        
        this.items = baseLayers.map(createButton);
        
        map.events.register('changebaselayer', this, this.onChangeBaseLayer);
        
        this.callParent(arguments);
    },
    onChangeBaseLayer: function(e) {
        this.items.each(function(button) {
            button.toggle(button.layer == e.layer, true);
        });
    }
});