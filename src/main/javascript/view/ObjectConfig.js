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
Ext.define('OpenEMap.view.ObjectConfig', {
    extend : 'Ext.form.Panel',
    statics: {
        config: {
            type: 'R',
            w: 10,
            l: 10,
            m1: 2,
            m2: 2,
            angle: 0
        }
    },
    fieldDefaults: {
        labelWidth: 60
    },
    autoHeight: true,
    width: 400,
    border: false,
    selectedFeature: undefined,
    layer: undefined,
    factory: undefined,
    hidden: true,
    defaults: {
        border: false
    },
    typeLabel: 'Type',
    widthLabel: 'Width',
    lengthLabel: 'Length',
    m1Label: 'M1',
    m2Label: 'M2',
    angleLabel: 'Angle',
    initComponent : function() {
        this.layer = this.mapPanel.drawLayer;
        this.factory = Ext.create('OpenEMap.ObjectFactory');
                        
        var types = {
            xtype : 'radiogroup',
            vertical : true,
            fieldLabel: this.typeLabel,
            itemId: 'type',
            hidden: true,
            items : [ {
                boxLabel : '<div class="objectconfig-radio-r"></div>',
                name : 'rb',
                inputValue : 'R',
                checked : true
            }, {
                boxLabel : '<div class="objectconfig-radio-l"></div>',
                name : 'rb',
                enabled: false,
                inputValue : 'L'
            }, {
                boxLabel : '<div class="objectconfig-radio-d"></div>',
                name : 'rb',
                enabled: false,
                inputValue : 'D'
            }, {
                boxLabel : '<div class="objectconfig-radio-o"></div>',
                name : 'rb',
                enabled: false,
                inputValue : 'O'
            } ],
            listeners: {
                change: function(field, value) {
                    this.config.type = value.rb;
                    this.updateHelpImage(this.config.type);
                    this.setFormItemVisibility(this.config.type);
                    this.createObject();
                },
                scope: this
            }
        };
        
        var formItems = [];
        
        formItems.push(types);
        
        formItems = formItems.concat([{
            xtype: 'numberfield',
            fieldLabel: this.widthLabel,
            itemId: 'w',
            minValue: 0,
            listeners: {
                change: function(field, value) {
                    this.config.w = value;
                    this.createObject();
                },
                scope: this
            }
        },{
            xtype: 'numberfield',
            fieldLabel: this.lengthLabel,
            itemId: 'l',
            minValue: 0,
            listeners: {
                change: function(field, value) {
                    this.config.l = value;
                    this.createObject();
                },
                scope: this
            }
        },{
            xtype: 'numberfield',
            fieldLabel: this.m1Label,
            itemId: 'm1',
            minValue: 0,
            listeners: {
                change: function(field, value) {
                    this.config.m1 = value;
                    this.createObject();
                },
                scope: this
            }
        },{
            xtype: 'numberfield',
            fieldLabel: this.m2Label,
            itemId: 'm2',
            minValue: 0,
            listeners: {
                change: function(field, value) {
                    this.config.m2 = value;
                    this.createObject();
                },
                scope: this
            }
        },{
            xtype: 'numberfield',
            itemId: 'angle',
            fieldLabel: this.angleLabel,
            value: 0,
            listeners: {
                change: function(field, value) {
                    this.config.angle = value;
                    this.createObject();
                },
                scope: this
            }
        }]);
        
        this.attributeFields = Ext.create('Ext.container.Container', { title: 'Attributes' });
        formItems.push(this.attributeFields);
        
        this.items = [ {
            layout: 'column',
            defaults: {
                border: false
            },
            padding: 5,
            items: [{
                width: 180,
                layout: 'form',
                items: formItems
            }, {
                columnWidth: 1,
                padding: 5,
                items: {
                    itemId: 'objectimage',
                    border: false,
                    height: 200
                }
            }]
        }];
        
        this.layer.events.register('featuremodified', this, this.onFeaturemodified);
        this.layer.events.register('beforefeatureselected', this, this.onBeforefeatureselected);
        this.layer.events.register('featureunselected', this, this.onFeatureunselected);

        this.callParent(arguments);
    },
    setConfig: function(config) {
        if (config === undefined) {
            this.config = Ext.clone(OpenEMap.view.ObjectConfig.config);
            this.down('#type').show();
        } else if (config.type) {
            this.config = Ext.clone(config);
            Ext.applyIf(this.config, OpenEMap.view.ObjectConfig.config);
            this.down('#type').hide();
        } else {
            this.config = Ext.clone(config);
            Ext.applyIf(this.config, OpenEMap.view.ObjectConfig.config);
            this.down('#type').show();
        }
        this.setFormValues();
        this.show();
        return this.config;
    },
    setFormValues: function() {
        if (this.config) {
            this.down('#type').setValue({'rb': this.config.type});
            this.updateHelpImage(this.config.type);
            this.down('#w').setRawValue(this.config.w);
            this.down('#l').setRawValue(this.config.l);
            this.down('#m1').setRawValue(this.config.m1);
            this.down('#m2').setRawValue(this.config.m2);
            this.down('#angle').setRawValue(this.config.angle);
            this.setFormItemVisibility(this.config.type);
            this.down('#angle').show();
        } else {
            this.down('#type').hide();
            this.down('#w').hide();
            this.down('#l').hide();
            this.down('#m1').hide();
            this.down('#m2').hide();
            this.down('#angle').hide();
            this.down('#objectimage').hide();
        }
        
        this.attributeFields.removeAll();
        if (this.selectedFeature) {
            Object.keys(this.selectedFeature.attributes).forEach(function(key) {
                this.createAttributeField(this.selectedFeature, key);
            }, this);
        }
        this.doLayout();
    },
    createAttributeField: function(feature, key) {
        if (key == 'config' || key == 'metadata') return;
        
        var metadata = feature.attributes.metadata;
        
        if (metadata && metadata[key] && metadata[key].hidden ) return;
        
        var value = feature.attributes[key];
        
        this.attributeFields.add({
            xtype: 'textfield',
            fieldLabel: key,
            value: value,
            listeners: {
                change: function(field, value) {
                    this.selectedFeature.attributes[key] = value;
                    this.layer.drawFeature(this.selectedFeature);
                },
                scope: this
            }
        });
    },
    setFormItemVisibility: function(type) {
        if (type == 'R') {
            this.down('#w').show();
            this.down('#l').show();
            this.down('#m1').hide();
            this.down('#m2').hide();
        } else if (type == 'L') {
            this.down('#w').show();
            this.down('#l').show();
            this.down('#m1').show();
            this.down('#m2').show();
        } else if (type == 'D') {
            this.down('#w').show();
            this.down('#l').show();
            this.down('#m1').show();
            this.down('#m2').hide();
        } else if (type == 'O') {
            this.down('#w').hide();
            this.down('#l').hide();
            this.down('#m1').show();
            this.down('#m2').hide();
        }
    },
    onFeaturemodified: function(e) {
        var feature = e.feature;
        config = feature.attributes.config;
        
        if (!config) return;
        
        this.down('#angle').setRawValue(config.angle);
    },
    onBeforefeatureselected: function(e) {
        var feature = e.feature;
        this.selectedFeature = feature;
        this.config = feature.attributes.config;
        
        var action = this.gui.activeAction;
        
        // customise modify feature behaviour depending on object type and modification mode flag
        if (action && action.control instanceof OpenLayers.Control.ModifyFeature) {
            if (this.config && (action.control._mode & OpenLayers.Control.ModifyFeature.RESHAPE)) {
                // use mode without reshape on predefined objects
                action.control.mode = action.control._mode ^ OpenLayers.Control.ModifyFeature.RESHAPE;
            } else {
                // restore mode
                action.control.mode = action.control._mode;
            }
            action.control.resetVertices();
        }
        
        this.show();
        
        this.setFormValues();
    },
    onFeatureunselected: function(e) {
        if (this.layer.selectedFeatures.length === 0) this.hide();
        
        this.selectedFeature = undefined;
    },
    createObject: function(x, y, style) {
        if (this.selectedFeature && this.selectedFeature.attributes.config) {
            // NOTE: for some strange reason replacing geometry components works, whereas replacing geometry causes strange render bugs
            var geometry = this.factory.create(this.config, style).geometry;
            this.selectedFeature.geometry.removeComponent(this.selectedFeature.geometry.components[0]);
            this.selectedFeature.geometry.addComponent(geometry.components[0]);
            this.selectedFeature.modified = true;
            this.selectedFeature.geometry.calculateBounds();
            this.mapPanel.map.controls.forEach(function(control) {
                if (control.CLASS_NAME == "OpenLayers.Control.ModifyFeature" && control.active) {
                    control.resetVertices();
                }
            });
            this.layer.drawFeature(this.selectedFeature);
            this.layer.events.triggerEvent('featuremodified', {
                feature: this.selectedFeature
            });
        }
    },
    updateHelpImage: function(type) {
        var name = 'figur-' + type + '-help.png';
        this.down('#objectimage').show();
        this.down('#objectimage').update('<img src="' + OpenEMap.basePathImages + name + '"></img>');
    }
});