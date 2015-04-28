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
 * Action in toolbar that zooms the user to full extent
 * 
 * The snippet below is from configuration to MapClient.view.Map
 * 
 * 
 *        "tools": ["Permalink"]
 */
Ext.define('OpenEMap.action.Permalink', {
    extend: 'OpenEMap.action.Action',
    constructor: function(config) {
        this.client = config.client;
    
        config.control = config.control = new OpenLayers.Control.Button({
            trigger: this.onClick.bind(this)
        });
        
        config.iconCls = config.iconCls || 'action-permalink';
        config.tooltip = config.tooltip || 'Generera permalink';
        
        this.callParent(arguments);
    },
    onClick: function() {
        this.generate();
    },
    generate: function() {
        var success = function(response) {
            var id = Ext.decode(response.responseText);
            
            this.createWindow(id);
        };
        
        Ext.Ajax.request({
            url: OpenEMap.wsUrls.permalinks,
            method: 'POST',
            jsonData: this.client.getPermalinkdata(),
            success: success.bind(this)
        });
    },
    createWindow: function(id) {
        var url = OpenEMap.wsUrls.permalinkclient + '?permalink=' + id;
        var label = '<a href="' + url + '" target="_blank">' + url + '</a>';
    
        if (this.w) {
            if (this.w.isHidden()) this.w.show();
            this.w.items.getAt(0).getComponent('permalink').update(label);
            return;
        }
        
        this.w = Ext.create('Ext.Window', {
            title: 'Permalink',
            layout: 'fit',
            xtype: 'form',
            width: 400,
            bodyPadding: 5,
            bodyStyle: {
                border: '0px'
            },
            plain: true,
            border: false,
            closeAction: 'hide',
            items: {
                layout: 'anchor',
                border: false,
                items: {
                    xtype: 'label',
                    name: 'permalink',
                    itemId: 'permalink',
                    readOnly: true,
                    border: false,
                    anchor: '100%',
                    html: label
                }
            },
            bbar: [ '->',
                {
                    text: 'Uppdatera',
                    handler: this.onClick.bind(this)
                }
            ]
        });
        this.w.show();
    }
    
});
