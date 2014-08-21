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
