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
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchPlacename', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchplacename',
    require: ['Ext.data.*',
              'Ext.form.*'],
    initComponent : function() {
        var kommunkod;
        var zoom = 5;
        if (this.search && this.search.options) {
            kommunkod = this.search.options.municipalities.join(',');
            zoom = this.search.options.zoom;
        }
                
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url : OpenEMap.basePathLM + 'placenames',
                extraParams: {
                    lmuser: OpenEMap.lmUser,
                    kommunkod: kommunkod
                },
                reader: {
                    type: 'json',
                    root: 'features'
                }
            },
            fields: [
                 {name: 'id', mapping: 'properties.id'},
                 {name: 'name', mapping: 'properties.name'}
             ]
        });
        
        this.labelWidth= 60;
        this.displayField= 'name';
        this.valueField= 'id';
        this.queryParam='q';
        this.typeAhead= true;
        this.forceSelection= true;
        
        this.listeners = {
            'select':  function(combo, records) {
                var fake = records[0].raw;
                var coords = fake.geometry.coordinates;
                var switchedAxis = [coords[1], coords[0]];
                this.mapPanel.map.setCenter(switchedAxis, zoom);
            },
            scope: this
        };
        
        this.callParent(arguments);
    }
});
