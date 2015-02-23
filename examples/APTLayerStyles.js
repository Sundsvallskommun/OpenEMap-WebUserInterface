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

var context = {
    getSymbol: function(feature) {
		switch(feature.attributes["id"]) {
		    case 1:
		    	return '../resources/images/shower.jpg';
		    case 2:
		    	return '../resources/images/cabin.jpg';
		    case 3:
		    	return '../resources/images/parking.png';
		    case 4:
		    	return '../resources/images/skiing.png';
		    default:
		    	return '../resources/images/point_added.png';
		}
	}   	
}

var templateDefault = {
    externalGraphic: "${getSymbol}",
	graphicWidth: 30, 
	graphicOpacity: 1
}
var templateSelect = {
    externalGraphic: "${getSymbol}",
	graphicWidth: 50, 
	graphicOpacity: 1
}
var styleDefault = new OpenLayers.Style(templateDefault, {context: context});
var styleSelect = new OpenLayers.Style(templateSelect, {context: context});

var stylemapGraphics = new OpenLayers.StyleMap({
    'default': styleDefault,
    'select': styleSelect
});
