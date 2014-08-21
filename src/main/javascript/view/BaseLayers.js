/*    
    Copyright (C) 2014 Härnösands kommun

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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