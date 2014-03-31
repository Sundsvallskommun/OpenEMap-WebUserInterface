/**
 * Action for print using mapfish.
 */
Ext.define('OpenEMap.action.Print', {
    extend : 'OpenEMap.action.Action',
    constructor : function(config) {
        var mapPanel = config.mapPanel;
        var printExtent = mapPanel.plugins[0];
        var printProvider = printExtent.printProvider;
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
                            xtype : 'combo',
                            fieldLabel: 'Pappersformat',
                            store : printProvider.layouts,
                            displayField : 'name',
                            valueField : 'name',
                            queryMode: 'local',
                            value: printProvider.layouts.first().get("name"),
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
