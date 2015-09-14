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
 * @author Anders Erlandsson, Sundsvalls kommun
 * Example styles to use with popupLayers 
 */
/*
* Layer stylemap
*/
// we want opaque external graphics and non-opaque internal graphics
var stylemapGraphics = new OpenLayers.StyleMap({
    'default': OpenLayers.Util.applyDefaults(
        {
        	externalGraphic: "../resources/images/point_added.png", 
        	graphicWidth: 15, 
        	graphicOpacity: 1
    	},
        OpenLayers.Feature.Vector.style['default']
    ),
    'select': OpenLayers.Util.applyDefaults(
        {
        	externalGraphic: "../resources/images/point_added.png", 
        	graphicWidth: 20
    	},
        OpenLayers.Feature.Vector.style.select
    )
});
stylemapGraphics.externalGraphic = "../resources/images/point_added.png"; 
stylemapGraphics.graphicWidth = 15; 
stylemapGraphics.graphicOpacity = 1; 

/*
 * Blue style
 */
var stylemapBlue = new OpenLayers.StyleMap({
    'default': OpenLayers.Util.applyDefaults(
        {
        	graphicWidth: 15, 
        	graphicOpacity: 1, 
    	},
        OpenLayers.Feature.Vector.style['default']
    ),
    'select': OpenLayers.Util.applyDefaults(
        {
        	graphicWidth: 20
    	},
        OpenLayers.Feature.Vector.style.select
    )
});
stylemapBlue.strokeColor = "blue";
stylemapBlue.fillColor = "blue";
stylemapBlue.graphicName = "star";
stylemapBlue.pointRadius = 10;
stylemapBlue.strokeWidth = 3;
stylemapBlue.rotation = 45;
stylemapBlue.strokeLinecap = "butt";

/*
 * Green style based on stylemapGraphics
 */
var stylemapGreen = OpenLayers.Util.extend({}, stylemapGraphics);
stylemapGreen.strokeColor = "#00FF00";
stylemapGreen.strokeWidth = 3;
stylemapGreen.strokeDashstyle = "dashdot";
stylemapGreen.pointRadius = 6;
stylemapGreen.pointerEvents = "visiblePainted";
stylemapGreen.title = "this is a green line";
