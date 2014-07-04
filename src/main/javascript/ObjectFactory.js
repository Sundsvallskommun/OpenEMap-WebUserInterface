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
 * Creates predefined objects
 */
Ext.define('OpenEMap.ObjectFactory', {

    toPoint: function(coord) {
        return new OpenLayers.Geometry.Point(coord[0], coord[1]);
    },
    
    createR: function(config) {
        var x = config.x;
        var y = config.y;
        var l = config.l;
        var w = config.w;
        var coords = [
            [x    , y],
            [x    , y - l],
            [x + w, y - l],
            [x + w, y]
        ];
        var linearRing = new OpenLayers.Geometry.LinearRing(coords.map(this.toPoint));
        var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
        return polygon;
    },
    
    createL: function(config) {
        var x = config.x;
        var y = config.y;
        var l = config.l;
        var w = config.w;
        var m1 = config.m1;
        var m2 = config.m2;
        var coords = [
            [x     , y],
            [x     , y - w],
            [x + m1, y - w],
            [x + m1, y - m2],
            [x + l , y - m2],
            [x + l , y]
        ];
        var linearRing = new OpenLayers.Geometry.LinearRing(coords.map(this.toPoint));
        var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
        return polygon;
    },
            
    createD: function(config) {
        var x = config.x;
        var y = config.y;
        var l = config.l;
        var w = config.w;
        var m1 = config.m1;
        var m2 = config.m2;
        
        var o = (l-m1)/2;
        var coords = [
            [x        , y],
            [x        , y - w + o],
            [x + o    , y - w],
            [x + l - o, y - w],
            [x + l    , y - w + o],
            [x + l    , y]
        ];
                    
        var linearRing = new OpenLayers.Geometry.LinearRing(coords.map(this.toPoint));
        var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
        return polygon;
    },
    
    createO: function(config) {
        var x = config.x;
        var y = config.y;
        var l = config.l;
        var w = config.w;
        var m1 = config.m1;
        var m2 = config.m2;
        var r = ((m1/2)*(Math.sqrt((4+(2*Math.SQRT2)))));
        var origin = new OpenLayers.Geometry.Point(x + r, y - r);
        var polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(origin, r, 8);
        return polygon;
    },
    
    // NOTE: monkey patch rotate and resize to write resulting attributes on
    // change
    figurHooks: function(feature) {
        var oldMove = feature.geometry.move;
        feature.geometry.move = function(x, y) {
            feature.attributes.config.x += x;
            feature.attributes.config.y += y;
            oldMove.apply(feature.geometry, arguments);
        };
        
        var oldRotate = feature.geometry.rotate;
        feature.geometry.rotate = function(angle, origin) {
            feature.attributes.config.angle += angle;
            // TODO: rotate will change point of origin causing jumps if object is recreated
            // TODO: tried to fix below but isn't correct...
            //var point = feature.geometry.components[0].components[0];
            //feature.attributes.config.x = point.x;
            //feature.attributes.config.y = point.y;
            oldRotate.apply(feature.geometry, arguments);
        };
        
        // NOTE: dynamic resizing isn't allowed
        /*var oldResize = feature.geometry.resize;
        feature.geometry.resize = function(scale, origin, ratio) {
            feature.attributes.scale += scale;
            feature.attributes.origin = origin;
            feature.attributes.ratio = ratio;
            oldResize.apply(feature.geometry, arguments);
        };*/
    },
    create: function(config, attributes, style) {
        var geometry;
        if (config.type=='R') {
            geometry = this.createR(config);
        } else if (config.type=='L')    {
            geometry = this.createL(config);
        } else if (config.type=='D') {
            geometry = this.createD(config);
        } else {
            geometry = this.createO(config);
        }
        var center = geometry.getCentroid();
        var originGeometry = new OpenLayers.Geometry.Point(center.x, center.y);
        geometry.rotate(config.angle, originGeometry);
        var feature = new OpenLayers.Feature.Vector(geometry, attributes, style);
        this.figurHooks(feature);
        feature.attributes.config = config;
        return feature;
    }
});