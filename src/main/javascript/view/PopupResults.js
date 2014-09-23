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
 * 
 */
Ext.define('OpenEMap.view.PopupResults', {
    extend : 'GeoExt.window.Popup',
    autoScroll : true,
    layout: {
        type: 'vbox',
        pack:'start',
        align: 'stretch'
    },
    popup: null,
    constructor: function(config) {
        if (this.popup) {
            this.popup.destroy();
        }
	    this.popup = Ext.create('GeoExt.window.Popup', {
			title: "Information om objekt",
		    location: config.location,
		    html: config.popupText,
		    collapsible: true,
            anchored: true,
            unpinnable: false,
            draggable: true,
            map: config.mapPanel,
            maximizable : false,
            minimizable : false,
            resizable: true,
            layout: 'fit',
            collapsible: false,
            listeners : {
                close : function(){
                	// TODO - clean up on close? Unselect features?
			        if (this.popup) {
			            this.popup.destroy();
			        }
                }
            }
		});
		return this.popup;
    },
    /**
     * @param {OpenLayers.Feature.Vector} feature to show
     */
    showFeature: function(feature, layer) {
		// TODO - Highlight feature in map
		// TODO - Show popup with html
    }
});