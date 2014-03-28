/**
 * Custom panel to represent a floating zoom slider
 */
Ext.define('OpenEMap.view.ZoomTools', {
    extend : 'Ext.panel.Panel',
    bodyStyle : 'background : transparent',
    border: false,
    getTools : function() {
        var oep = Ext.util.CSS.getRule('.oep-tools');
        var scale = oep ? 'large' : 'medium';
        var margin = oep ? '5 0 5 0' : '5 0 5 8';
        
        var pile = [];
        var slider = Ext.create('GeoExt.slider.Zoom', {
            height : 200,
            vertical : true,
            aggressive : true,
            margin  : margin,
            map : this.mapPanel.map
        });
        pile.push({
            xtype : 'button',
            iconCls: 'zoomtools-plus',
            mapPanel : this.mapPanel,
            scale: scale,
            cls: 'x-action-btn',
            listeners : {
                'click' : function() {
                    this.mapPanel.map.zoomIn();
                },
                scope: this
            }
        });
        pile.push(slider);
        pile.push({
            xtype : 'button',
            scale: scale,
            cls: 'x-action-btn',
            iconCls: 'zoomtools-minus',
            mapPanel : this.mapPanel,
            listeners : {
                'click' : function() {
                    this.mapPanel.map.zoomOut();
                },
                scope: this
            }
        });
        return pile;
    },

    constructor : function(config) {
        Ext.apply(this, config);

        this.items = this.getTools();

        this.callParent(arguments);
    }

});