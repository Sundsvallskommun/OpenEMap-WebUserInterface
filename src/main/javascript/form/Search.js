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
        
        // TODO: need to do requests on input
        // TODO: 
        function doSearch() {
            Ext.Ajax.request({
                url: '',
                success: function(response) {
                    
                },
                failure: function() {
                    Ext.Msg.alert('Fel', 'Okänt.');
                },
                callback: function() {
                    this.mapPanel.setLoading(false);
                },
                scope: this
            });
        }
        
        this.reader = Ext.create('Ext.data.reader.Json', {
            //root: function(data) {
            //    return data.hits.hits;
            //},
            root: 'hits.hits',
            //record: '_source',
            totalProperty: 'hits.total',
            idProperty: '_id'
        });
        
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '//10.26.90.160:9200/_search',
                reader: this.reader
            },
            fields: ['_id', '_source'],
        });
        
        this.labelWidth = 60;
        this.displayField = '_source.message';
        this.valueField = '_id';
        this.queryParam ='q';
        //this.typeAhead = true;
        //this.forceSelection = true;
        
        this.listeners = {
            'select':  function(combo, records) {
                //doSearch.call(this, records[0].data.fnr, records[0].data.x, records[0].data.y);
            },
            'beforequery': function(queryPlan) {
                /*if (registeromrade && queryPlan.query.match(registeromrade) === null) {
                    queryPlan.query = registeromrade + ' ' + queryPlan.query;
                }*/
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
