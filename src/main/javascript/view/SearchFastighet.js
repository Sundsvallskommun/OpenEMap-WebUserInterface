/**
 * @param {number} config.zoom Set to a zoom level to override default zooming behaviour and always zoom to the desired level
 */
Ext.define('OpenEMap.view.SearchFastighet', {
    extend : 'Ext.form.Panel',
    requires : [
                'OpenEMap.form.SearchRegisterenhet',
                'OpenEMap.form.SearchAddress',
                'OpenEMap.form.SearchPlacename',
                'GeoExt.selection.FeatureModel'],
    border: false,
    zoom: undefined,
    initComponent : function() {

        if (!this.renderTo) {
            this.title = 'Sök fastighet';
            this.bodyPadding = 5;
        }
        
        var data = [
                    [ 'searchregisterenhet', 'Fastighet' ],
                    [ 'searchaddress', 'Adress' ],
                    [ 'searchplacename', 'Ort' ]/*,
                    [ 'searchbyggnad', 'Byggnad' ]*/
                    ];

        var columns = [ {
            text : 'Namn',
            dataIndex : 'name',
            flex : 1
        } ];

        var store = Ext.create('GeoExt.data.FeatureStore', {
            layer : this.mapPanel.searchLayer,
            featureFilter: new OpenLayers.Filter.Function({
                evaluate: function(context) {
                    if (context.attributes.name) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }),
            fields : [ {
                name : 'name'
            }, {
                name : 'fid'
            }, {
                name : 'objid'
            } ]
        });
        
        var grid = Ext.create('Ext.grid.Panel', {
            columns : columns,
            store : store,
            selType : 'featuremodel'
        });
        
        function defSearchCombo(type) {
            return {
                xtype : type,
                mapPanel : this.mapPanel,
                basePath: this.basePath,
                search : type ===  'searchregisterenhet' ? this.search.searchEstates : 
                         type ===  'searchaddress' ? this.search.searchAddresses : this.search.searchPlacenames,
                zoom: this.zoom,
                resultPanel : grid
            };
        }
        
        function onChange(combo, value) {
            var container = this.down('#search');
            this.mapPanel.searchLayer.destroyFeatures();
            container.removeAll();
            container.add(defSearchCombo.call(this,value));
        }

        this.items = [ {
            layout : 'column',
            border: false,
            items : [ {
                xtype : 'combo',
                width : 110,
                store : data,
                forceSelection : true,
                queryMode : 'local',
                value : 'searchregisterenhet',
                border: false,
                listeners : {
                    change : onChange,
                    scope : this
                }
            }, {
                itemId : 'search',
                columnWidth : 1,
                layout : 'fit',
                border: false,
                items : defSearchCombo.call(this,'searchregisterenhet')
            } ]    }
        ];
        
        if (!this.renderTo) {
            this.items.push(grid);
        }

        this.callParent(arguments);
    }
});