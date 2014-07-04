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
 * Form field based on combobox to select zoom level
 */
Ext.define('OpenEMap.form.ZoomSelector' ,{
    extend: 'Ext.form.ComboBox',
    emptyText: "Zoom Level",
    listConfig: {
        getInnerTpl: function() {
            return "1: {scale:round(0)}";
        }
    },
    width: 120,
    editable: false,
    triggerAction: 'all',
    queryMode: 'local',
    initComponent: function() {
        this.store = Ext.create("GeoExt.data.ScaleStore", {map: this.map});
        this.listeners = {
            select: {
                fn:function(combo, record, index) {
                    this.map.zoomTo(record[0].get("level"));
                },
                scope:this
            }
        };
        this.map.events.register('zoomend', this, function() {
            var scale = this.store.queryBy(function(record){
                return this.map.getZoom() == record.data.level;
            });

            if (scale.length > 0) {
                scale = scale.items[0];
                this.setValue("1 : " + parseInt(scale.data.scale));
            } else {
                if (!zoomSelector.rendered) return;
                this.clearValue();
            }
        });
        this.callParent(arguments);
    }
});

        