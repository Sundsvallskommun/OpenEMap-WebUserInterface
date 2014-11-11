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
Ext.define('OpenEMap.form.Search', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.search',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var layer = this.mapPanel.searchLayer;

        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '//localhost:9200/_search',
                reader: {
                    type: 'json',
                    root: 'hits.hits',
                    totalProperty: 'hits.total',
                    idProperty: '_id'
                }
            },
            fields: [
                { name: 'type', mapping: '_type' },
                { name: 'hit', mapping: '_source.message' },
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
                // TODO: if geometry, parse it, add to searchLayer and zoom it
                // records[0].data
            },
            'beforequery': function(queryPlan) {
                queryPlan.query = queryPlan.query + '*'
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
