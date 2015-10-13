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
    emptyText: 'Sök detaljplan...',
    selectOnFocus: true,
    displayField: 'hit',
    valueField: 'id',
    queryParam: 'q',
    typeAhead: true,
    forceSelection: true,
    allowBlank: false,
    allowOnlyWhitespace: false,
    preventMark: true,
    minChars: 1,
    
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
                { name: 'hit', mapping: '_source.properties.TEXT' }, // Could be AKT="2281K-NJU-268" or PLANNUMMER="S5086"
                { name: 'geometry', mapping: '_source.geometry' }
            ]
        });
        
	    this.clearSearchString = function(e,el,panel) {
	    	if (typeof panel === "undefined") {
	    		panel = this;
	    	}
		    panel.clearValue();
		    panel.collapse();
			layer.destroyFeatures();
			panel.focus();
	    };

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
            	if (queryPlan.query.length < this.minChars) {
            		queryPlan.cancel = true;
            	} else {
	                queryPlan.query = '"' + queryPlan.query + '"' + '*';
	            }
            },
            scope: this
        };
        
        // Drop down arrow replaced by reset button 
	    this.trigger1Cls = 'x-form-clear-trigger';
	    this.onTrigger1Click = this.clearSearchString;

        this.callParent(arguments);
    }
});
