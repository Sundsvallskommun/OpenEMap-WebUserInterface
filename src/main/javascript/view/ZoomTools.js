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
 * Custom panel to represent a floating zoom slider
 */
Ext.define('OpenEMap.view.ZoomTools', {
    extend : 'Ext.panel.Panel',
    requires: ['GeoExt.slider.Zoom'],
    bodyStyle : 'background : transparent',
    border: false,
    getTools : function() {
        var oep = Ext.util.CSS.getRule('.oep-tools');
        var scale = oep ? 'large' : 'medium';
        var margin = oep ? '5 0 5 0' : '5 0 5 8';
        
        var pile = [];
        var slider = Ext.create('GeoExt.slider.Zoom', {
            height : 160,
            vertical : true,
            aggressive : true,
            margin  : margin,
            map : this.mapPanel.map
        });
        pile.push({
            xtype : 'button',
            iconCls: 'zoomtools-plus',
            mapPanel : this.mapPanel,
            scale: scale,
            cls: 'x-action-btn',
            listeners : {
                'click' : function() {
                    this.mapPanel.map.zoomIn();
                },
                scope: this
            }
        });
        pile.push(slider);
        pile.push({
            xtype : 'button',
            scale: scale,
            cls: 'x-action-btn',
            iconCls: 'zoomtools-minus',
            mapPanel : this.mapPanel,
            listeners : {
                'click' : function() {
                    this.mapPanel.map.zoomOut();
                },
                scope: this
            }
        });
        return pile;
    },

    constructor : function(config) {
        Ext.apply(this, config);

        this.items = this.getTools();

        this.callParent(arguments);
    }

});
