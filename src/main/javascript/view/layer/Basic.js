Ext.define('OpenEMap.view.layer.Basic' ,{
    extend: 'OpenEMap.view.layer.Tree',

    //autoScroll: true,
    //lines: false,
    overflowY: 'auto',
    rootVisible: false,
    //width: 300,
    height: 300,
    border: false,

    initComponent: function() {
        if (!this.renderTo) {
            this.title = 'Lager';
            this.bodyPadding = 5;
            this.collapsible = true;
        }
        
        this.callParent(arguments);
    }


});