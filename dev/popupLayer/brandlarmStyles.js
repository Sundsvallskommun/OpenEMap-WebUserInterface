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
var stylemapBrandlarm = new OpenLayers.StyleMap({
    'default': OpenLayers.Util.applyDefaults(
        {
        	externalGraphic: "../resources/images/point_added.png", 
        	graphicWidth: 20,
        	graphicOpacity: 1
    	},
        OpenLayers.Feature.Vector.style['default']
    ),
    'select': OpenLayers.Util.applyDefaults(
        {
        	externalGraphic: "../resources/images/point_added.png", 
        	graphicWidth: 30
    	},
        OpenLayers.Feature.Vector.style.select
    )
});
