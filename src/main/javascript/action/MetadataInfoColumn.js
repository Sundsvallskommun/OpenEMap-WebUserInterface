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