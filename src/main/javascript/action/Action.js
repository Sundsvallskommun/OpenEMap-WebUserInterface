/**
 * Base class for adding common functionality upon GeoExt.Action
 * 
 * @param {string} config.minScale disable tool below this scale
 * @param {string} config.maxScale disable tool above this scale
 */
Ext.define('OpenEMap.action.Action', {
    extend: 'GeoExt.Action',
    constructor: function(config) {
        var mapPanel = config.mapPanel;
        var map = mapPanel.map;
                
        if (config.minScale || config.maxScale) {
            if (!config.minScale) config.minScale = 0;
            if (!config.maxScale) config.maxScale = 99999999999999;
            
            var onZoomend = function() {
                if (map.getScale() >= config.maxScale ||
                    map.getScale() <= config.minScale) {
                    this.disable();
                } else {
                    this.enable();
                }
            };
            
            map.events.register('zoomend', this, onZoomend);
        }
        
        this.callParent(arguments);
    },
    /**
     * To be implemented by actions that need special logic on toggle
     * @abstract
     */
    toggle: function() {}
});
