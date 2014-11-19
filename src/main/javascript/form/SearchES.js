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
 * Combobox that uses ES for generic search
 */
Ext.define('OpenEMap.form.SearchES', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searches',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var map = this.mapPanel.map;
        var layer = this.mapPanel.searchLayer;

        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: OpenEMap.basePathES + '_search',
                reader: {
                    type: 'json',
                    root: 'hits.hits',
                    totalProperty: 'hits.total',
                    idProperty: '_id'
                }
            },
            fields: [
                { name: 'type', mapping: '_type' },
                { name: 'hit', mapping: '_source.properties.AKT' },
                { name: 'geometry', mapping: '_source.geometry' }
            ]
        });
        
        this.displayField = 'hit';
        this.valueField = 'id';
        this.queryParam ='q';
        this.typeAhead = true;
        this.forceSelection = true;
        this.allowBlank = false;
        this.allowOnlyWhitespace = false;
        this.minChars = 4;
        this.minLength = 4;
        this.preventMark = true;
        this.hideTrigger = true;
        
        this.listeners = {
            'select':  function(combo, records) {
                var geojson = records[0].data.geometry;
                var format = new OpenLayers.Format.GeoJSON({
                    ignoreExtraDims: true
                });
                var geometry = format.read(geojson, 'Geometry');
                var feature = new OpenLayers.Feature.Vector(geometry);
                layer.destroyFeatures();
                layer.addFeatures([feature]);
                map.zoomToExtent(feature.geometry.getBounds());
            },
            'beforequery': function(queryPlan) {
                queryPlan.query = queryPlan.query + '*';
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
