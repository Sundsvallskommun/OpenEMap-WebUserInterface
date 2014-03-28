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

        