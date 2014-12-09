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
 * Gui for showing coordinates in map
 * @param {Object} [config] config object to set properties on cretaion
 * @param {Object} [config.cls] CSS-class to apply when rendering 
 */
Ext.define('OpenEMap.view.ShowCoordinate', {
    extend : 'Ext.container.Container',
    defaults: {
        labelWidth: 10
    },
    border: false,
    layout: 'column',
    width: 150,
    srs: '',
    constructor : function(config) {
        this.items = [ {
            itemId: 'e',
            fieldLabel: 'E',
            xtype : 'textfield',
            columnWidth: 0.5,
            baseCls: config.cls,
            baseBodyCls: config.cls,
            bodyCls: config.cls,
            fieldCls: config.cls,
            fieldBodyCls: config.cls,
            formItemCls: config.cls, 
            inputRowCls: config.cls,
            labelCls: config.cls
        },{
            itemId: 'n',
            fieldLabel: 'N',
            xtype : 'textfield',
            columnWidth: 0.5,
            baseCls: config.cls,
            baseBodyCls: config.cls,
            bodyCls: config.cls,
            fieldCls: config.cls,
            fieldBodyCls: config.cls,
            formItemCls: config.cls, 
            inputRowCls: config.cls,
            labelCls: config.cls
        }];
        
        this.callParent(arguments);
    }
});