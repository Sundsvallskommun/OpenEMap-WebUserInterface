/*
    Copyright (C) 2016 Härnösands kommun
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

Ext.define('OpenEMap.action.Altitude', {
    extend: 'OpenEMap.action.Action',

    constructor: function(config) {
      var mapPanel = config.mapPanel;
      var layer = new OpenLayers.Layer.Vector("Altitude");
      //console.log(layer);
      var map = config.map;
      var coordinates =  "";
      map.addLayer(layer);

      var popup = null;

      if (config.useRegisterenhet === null) {
        config.useRegisterenhet = true;
      }
      config.tolerance = config.tolerance || 3;
      if (config.onlyVisibleLayers === null) {
        config.onlyVisibleLayers = true;
      }

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
          onClick: function(evt) {
              // Show graphhic for start loading
              mapPanel.setLoading(true);
              layer.destroyFeatures();
              if(popup){
                popup.hide();
              }
              var lonlat = map.getLonLatFromPixel(evt.xy);
              var x = lonlat.lon;
              var y = lonlat.lat;
              console.log(x + " : " + y);
              coordinates = " x:" + x + " : y:" + y;
              var lowerLeftImage = {};
      				var upperRightImage = {};
      				upperRightImage.x = evt.xy.x+config.tolerance;
              lowerLeftImage.x = evt.xy.x-config.tolerance;
              upperRightImage.y = evt.xy.y+config.tolerance;
              lowerLeftImage.y = evt.xy.y-config.tolerance;
              var lowerLeftLonLat = map.getLonLatFromPixel(lowerLeftImage);
              var upperRightLonLat = map.getLonLatFromPixel(upperRightImage);

              // Create search bounds for identify
              var point = new OpenLayers.Geometry.Point(x, y);

              var bounds = new OpenLayers.Bounds();
              bounds.extend(lowerLeftLonLat);
              bounds.extend(upperRightLonLat);

              var feature = new OpenLayers.Feature.Vector(point);
              layer.addFeatures([feature]);
              createPopup(feature);

              mapPanel.setLoading(false);
            }
      });

    // define "createPopup" function
    function createPopup(feature) {
      popup = new GeoExt.Popup({
          title: 'Höjd',
          location: feature,
          width:200,
          html: "X och Y;" + coordinates,
          maximizable: true,
          collapsible: true,
          listeners : {
              close : function(){
                  layer.removeAllFeatures();
              }
          }
      });

        popup.show();
    }



    layer.events.on({
        featureselected: function(e) {
            createPopup(e.feature);
        }
    });

      config.control = new Click({
          type: OpenLayers.Control.TYPE_TOGGLE
      });

      config.iconCls = config.iconCls || 'action-identify';
      config.tooltip = config.tooltip || 'Höjdmätning';
      config.toggleGroup = 'extraTools';

      this.callParent(arguments);
    }
  });
