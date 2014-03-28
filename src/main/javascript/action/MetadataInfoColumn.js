/**
 * Grid action column that shows layer metadata
 * 
 */

Ext.define('OpenEMap.action.MetadataInfoColumn', {
    extend: 'Ext.grid.column.Action',

    requrires: [
        'Ext.tip.ToolTip',
        'OpenEMap.data.DataHandler',
        'OpenEMap.view.MetadataWindow'
    ],

    text: '',
    width: 22,
    menuDisabled: true,
    xtype: 'actioncolumn',
    align: 'center',
    iconCls: 'action-identify',

    initComponent: function(options) {
        var me = this;

        this.tip = Ext.create('Ext.tip.ToolTip', {
            trackMouse: true
        });

        this.listeners = {
            mouseover: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                me.tip.setTarget(event.target);
                if(me.dataHandler) {
                    me.dataHandler.getMetadataAbstract(me.getUUIDFromMetadataUrl(record.get('urlToMetadata')), function(json){
                        if(json['abstract']) {
                            me.updateTooltip(json['abstract']);
                        }
                    });
                }
            },
            mouseout: function() {
                me.tip.update(null);
                me.tip.hide();
            },
            click: function(grid, element, rowIndex, colIndex, event, record) {
                if(me.metadataWindow) {
                    me.tip.update(null);
                    me.metadataWindow.showMetadata(me.getUUIDFromMetadataUrl(record.get('urlToMetadata')));
                }
                
            }
        };

        this.callParent(arguments);
    },

    /**
    * Update tooltip for this column
    * @param {string}  string   string to show in tooltip
    */
    updateTooltip: function(str) {
        if(str) {
            this.tip.update(str.substr(0,180) + '...');
            this.tip.show();
        }
    },

    /**
    * Experimetnal function to get metadata uuid from an url
    * @param  {string}           url  metadata-url containing metadata uuid
    * @return {string/undefined} 
    */
    getUUIDFromMetadataUrl: function(url) {
        if(url) {
            var start = url.indexOf('id=');
            if(start > 0) {
                return url.substr(start+3,36);
            }
        }
        return url;
    }

});