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
 * Specialised draw Action that draws predefined objects
 * 
 * Predefined objects can either be configured when constructing the action and/or defined
 * by a corresponding (optional) ObjectConfig view.
 */
Ext.define('OpenEMap.action.DrawObject', {
    extend: 'OpenEMap.action.Action',
    requires: ['OpenEMap.ObjectFactory',
               'OpenEMap.view.ObjectConfig'],
    /**
     * NOTE: objectConfigView is assumed to be supplied as a config object
     * 
     * @param {Object} config
     * @param {Object} config.objectConfig
     * @param {string} config.objectConfig.type available types are 'R', 'L', 'D', 'O'
     * @param {number} config.objectConfig.w
     * @param {number} config.objectConfig.l
     * @param {number} config.objectConfig.m1
     * @param {number} config.objectConfig.m2
     * @param {number} config.objectConfig.angle rotation
     */
    constructor: function(config) {
        this.mapPanel = config.mapPanel;
        this.layer = this.mapPanel.drawLayer;
        this.style = config.style;
        this.attributes = config.attributes;
        this.objectConfig = config.objectConfig;
        this.objectConfigView = config.objectConfigView;
        this.factory = Ext.create('OpenEMap.ObjectFactory');
        
        this.attributes = this.attributes || {};
                    
        var Click = OpenLayers.Class(OpenLayers.Control, {
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
                this.handler = new OpenLayers.Handler.Click(
                    this, {
                        'click': this.onClick
                    }, this.handlerOptions
                );
            },
            onClick: Ext.bind(this.onClick, this)
        });
        
        config.control = new Click({
            type: OpenLayers.Control.TYPE_TOGGLE
        });
        
        config.iconCls = config.iconCls || 'action-drawobject';
        config.tooltip = config.tooltip || 'Rita f&ouml;rdefinierad form.';
        config.toggleGroup = 'extraTools';
        
        this.callParent(arguments);
    },
    onClick: function(e) {
        var lonlat = this.mapPanel.map.getLonLatFromPixel(e.xy);
        var config = this.objectConfigView ? this.objectConfigView.config : OpenEMap.view.ObjectConfig.config;
        config = Ext.clone(config);
        config.x = lonlat.lon;
        config.y = lonlat.lat;
        var feature = this.factory.create(config, this.attributes, this.style);
        this.mapPanel.unselectAll();
        this.layer.addFeatures([feature]);
        this.mapPanel.selectControl.select(feature);
    },
    toggle: function(pressed) {
        if (pressed) this.objectConfigView.setConfig(this.objectConfig);
    }
});
