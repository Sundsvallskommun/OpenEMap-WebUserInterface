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
 * @param {Object} [config] config object to set properties on cretaion
 * @param {number} [config.zoom] Set to a zoom level to override the default
 */
Ext.define('OpenEMap.view.SearchCoordinate', {
    extend : 'Ext.container.Container',
    layout: 'column',
    defaults: {
        labelWidth: 20
    },
    width: 300,
    border: false,
    zoom: 5,
    initComponent : function(config) {
        var layer = this.mapPanel.searchLayer;

        this.items = [ {
            itemId: 'e',
            fieldLabel: 'E',
            xtype : 'textfield',
            columnWidth: 0.5
        },{
            itemId: 'n',
            fieldLabel: 'N',
            xtype : 'textfield',
            columnWidth: 0.5
        }, {
            xtype: 'button',
            text: 'Sök',
            handler: function() {
                var x = this.down('#e').getValue();
                var y = this.down('#n').getValue();
                this.mapPanel.map.setCenter([x, y], this.zoom);

                layer.destroyFeatures();
                var point = new OpenLayers.Geometry.Point(x, y);
                feature = new OpenLayers.Feature.Vector(point);
                layer.addFeatures([feature]);

                this.fireEvent('searchcomplete', [x, y]);
            },
            scope: this
        }];
        
        this.addEvents([/**
                         * @event searchcomplete
                         * Fires after coordinate search is complete
                         * @param {Array.<Number>} coordinate
                         */
                        'searchcomplete']);
        
        this.callParent(arguments);
    }
});