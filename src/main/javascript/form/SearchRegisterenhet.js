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
 * Combobox that searches from LM with type ahead.
 */
Ext.define('OpenEMap.form.SearchRegisterenhet', {
    extend : 'Ext.form.field.ComboBox',
    alias: 'widget.searchregisterenhet',
    require: ['Ext.data.*',
              'Ext.form.*'],
    selectOnFocus: true,
    forceSelection: true,
    editable: true,

    typeAhead: true,
    minChars: 4,
    
    queryDelay: 800,
    emptyText: 'Sök fastighet...',
    labelWidth: 60,
    displayField: 'name',
    valueField: 'id',
    queryParam: 'q',
    initComponent : function() {
        var registeromrade;
        var zoom;
        if (this.search && this.search.options){
            registeromrade = this.search.options.municipalities.join(',');
            zoom = this.search.options.zoom;
        }
        var layer = this.mapPanel.searchLayer;
        
        function doSearch(id) {
            this.mapPanel.setLoading(true);
            this.mapPanel.searchLayer.destroyFeatures();
            OpenEMap.requestLM({
                url: 'registerenheter/' + id + '/enhetsomraden?',
                success: function(response) {
                    this.resultPanel.expand();
                    var features = new OpenLayers.Format.GeoJSON().read(response.responseText);
                    layer.addFeatures(features);
                    var extent = layer.getDataExtent();
                    if (zoom) {
                        this.mapPanel.map.setCenter(extent.getCenterLonLat(), zoom);
                    } else {
                        this.mapPanel.map.zoomToExtent(extent);
                    }
                },
                failure: function() {
                    Ext.Msg.alert('Fel', 'Ingen träff.');
                },
                callback: function() {
                    this.mapPanel.setLoading(false);
                },
                scope: this
            });
        }
        
        this.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url : OpenEMap.basePathLM + 'registerenheter',
                extraParams: {
                    lmuser: OpenEMap.lmUser
                },
                reader: {
                    type: 'json',
                    root: 'features'
                }
            },
            fields: [
                 {name: 'id', mapping: 'properties.objid'},
                 {name: 'name', mapping: 'properties.name'}
             ]
        });
        
        this.store.on('beforeload', function(store, operation) {
          store.lastOperation = operation;
        }, this);
        
        
	    this.clearSearchString = function(e,el,panel) {
	    	if (typeof panel === "undefined") {
	    		panel = this;
	    	}
		    panel.clearValue();
		    panel.collapse();
			layer.destroyFeatures();
			panel.focus();
	    };

        this.listeners = {
            'select':  function(combo, records) {
                var id = records[0].get('id');
                doSearch.call(this, id);
            },
            'beforequery': function(queryPlan) {
                if (registeromrade && queryPlan.query.match(registeromrade) === null) {
                    queryPlan.query = registeromrade + ' ' + queryPlan.query;
                }
                var lastQ = this.store.lastOperation && this.store.lastOperation.request && this.store.lastOperation.request.params && this.store.lastOperation.request.params.q ? this.store.lastOperation.request.params.q : undefined;
		        if (this.store.loading && this.store.lastOperation) {
		          var requests = Ext.Ajax.requests;
		          for (var id in requests)
		            if (requests.hasOwnProperty(id) && requests[id].options == this.store.lastOperation.request) {
		              Ext.Ajax.abort(requests[id]);
		            }
		        }
            },
            scope: this
        };
        
        // Drop down arrow replaced by reset button 
	    this.trigger1Cls = 'x-form-clear-trigger';
	    this.onTrigger1Click = this.clearSearchString;
	    
        this.callParent(arguments);
    }
});
