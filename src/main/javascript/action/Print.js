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
 * Action for print using mapfish.
 */
Ext.define('OpenEMap.action.Print', {
    extend : 'OpenEMap.action.Action',
    constructor : function(config) {
        var mapPanel = config.mapPanel;
        var printExtent = mapPanel.plugins[0];
        var printProvider = printExtent.printProvider;
        printProvider.customParams = {attribution: config.mapPanel.config.attribution.trim()};
        var printDialog = null;
        var page = null;

        var onTransformComplete = function() {
            var scale = printDialog.down('#scale');
            scale.select(page.scale);
        };
        var onBeforedownload = function() {
            if (printDialog) printDialog.setLoading(false);
        };
        var onPrintexception = function(printProvider, response) {
            if (printDialog) printDialog.setLoading(false);
            Ext.Msg.show({
                 title:'Felmeddelande',
                 msg: 'Print failed.\n\n' + response.responseText,
                 icon: Ext.Msg.ERROR
            });
        };
        var close = function() {
            printProvider.un('beforedownload', onBeforedownload);
            printProvider.on('printexception', onPrintexception);
            printExtent.control.events.unregister('transformcomplete', null, onTransformComplete);
            printExtent.removePage(page);
            printExtent.hide();
            printDialog = null;
        };
        var onClose = function() {
            close();
            control.deactivate();
        };
        
        config.iconCls = config.iconCls || 'action-print';
        config.tooltip = config.tooltip || 'Skriv ut';
        config.toggleGroup = 'extraTools';
        
        var Custom =  OpenLayers.Class(OpenLayers.Control, {
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
            },
            type: OpenLayers.Control.TYPE_TOGGLE,
            activate: function() {
                if (printDialog) {
                    return;
                }
                // NOTE: doing a hide/show at first display fixes interaction problems with preview extent for unknown reasons
                printExtent.hide();
                printExtent.show();
                page = printExtent.addPage();
                
                
                printProvider.dpis.data.items.forEach(function(d){
                	var validDpi = false;
                	if (d.data.name === '56'){
                		validDpi = true;
                		d.data.name = 'Låg';
                	} 
                	else if (d.data.name === '127'){
                		validDpi = true;
                		d.data.name = 'Medel';
                	}
                	else if (d.data.name === '254'){
                		validDpi = true;
                		d.data.name = 'Hög';
                	} 
                });
                
                
                printProvider.layouts.data.items.forEach(function(p){
                	if (/landscape$/.test(p.data.name)){
                		p.data.displayName = p.data.name.replace('landscape', 'liggande');
                	} else if (/portrait$/.test(p.data.name)){
                		p.data.displayName = p.data.name.replace('portrait', 'stående');	
                	}
                });

                
                
                printDialog = new Ext.Window({
                    autoHeight : true,
                    width : 290,
                    resizable: false,
                    layout : 'fit',
                    bodyPadding : '5 5 0',
                    title: 'Utskriftsinst&auml;llningar',
                    listeners: {
                        close: onClose
                    },
                    items : [ {
                        xtype : 'form',
                        layout : 'anchor',
                        defaults : {
                            anchor : '100%'
                        },
                        fieldDefaults : {
                            labelWidth : 120
                        },
                        items : [ {
                            xtype : 'textfield',
                            fieldLabel: 'Rubrik',
                            valueField: 'mapTitle',
                            itemId : 'mapTitle',
                            queryMode: 'local',
                            value: printProvider.customParams.mapTitle,
                            listeners: {
                                change: function(textfield){
                                    printProvider.customParams.mapTitle = textfield.value;
                                }
                            }
                        },{
                            xtype : 'combo',
                            fieldLabel: 'Pappersformat',
                            store : printProvider.layouts,
                            displayField : 'displayName',
                            valueField : 'name',
                            itemId : 'printLayouts',
                            queryMode: 'local',
                            value : printProvider.layouts.getAt(0).get("name"),
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var record = records[0];
                                    printProvider.setLayout(record);
                                }
                            }
                        }, {
                            xtype : 'combo',
                            fieldLabel: 'Kvalité',
                            store : printProvider.dpis,
                            displayField : 'name',
                            valueField : 'value',
                            queryMode: 'local',
                            value: printProvider.dpis.first().get("value"),
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var record = records[0];
                                    printProvider.setDpi(record);
                                }
                            }
                        }, {
                            xtype : 'combo',
                            fieldLabel: 'Skala',
                            store : printProvider.scales,
                            displayField : 'name',
                            valueField : 'value',
                            queryMode: 'local',
                            itemId: 'scale',
                            value: printProvider.scales.first().get("value"),
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var record = records[0];
                                    page.setScale(record, "m");
                                }
                            }
                        } ]
                    } ],
                    bbar : [ '->', {
                        text : "Skriv ut",
                        handler : function() {
                            printDialog.setLoading(true);
                            printExtent.print();
                        }
                    } ]
                });
                printDialog.show();
                var scale = printDialog.down('#scale');
                scale.select(page.scale);
                
                var layoutId = 6;
                var printLayouts = printDialog.down('#printLayouts');
                printLayouts.select(printLayouts.store.data.get(layoutId));
                var currentPrintLayout = printLayouts.store.data.items[layoutId];
                printProvider.setLayout(currentPrintLayout);
                
                
                printExtent.control.events.register('transformcomplete', null, onTransformComplete);
                printExtent.control.events.register('transformcomplete', null, onTransformComplete);
                printProvider.on('beforedownload', onBeforedownload);
                printProvider.on('printexception', onPrintexception);
                
                OpenLayers.Control.prototype.activate.apply(this, arguments);
            },
            deactivate: function() {
                if (printDialog) printDialog.close();
                OpenLayers.Control.prototype.deactivate.apply(this, arguments);
            }
        });
        var control = new Custom({
            type: OpenLayers.Control.TYPE_TOGGLE
        });
        config.control = control;
        
        this.callParent(arguments);
    }
});
