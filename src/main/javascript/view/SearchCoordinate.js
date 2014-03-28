/**
 * @param {number} config.zoom Set to a zoom level to override the default
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