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
 */
var geojson = '';
geojson += '{';
geojson += '  "type": "FeatureCollection",';
geojson += '  "features": ';
geojson += '  [';
geojson += '    { ';
geojson += '      "type": "Feature",';
geojson += '      "geometry": {"type": "Point", "coordinates": [618186.0, 6919295.0]},';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 1,';
geojson += '        "popupTitle": "Lång titel",';
geojson += '        "popupText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"';
geojson += '      }';
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "LineString",';
geojson += '        "coordinates":';
geojson += '        [ [618500.0, 6920100.0], [618400, 6920100.0], [618400.0, 6920000.0], [618300, 6920000.0] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 2,';
geojson += '        "popupTitle": "Riktigt lång titel",';
geojson += '        "popupText": "LineString"';
geojson += '      }';
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "Polygon",';
geojson += '        "coordinates":';
geojson += '        [ [ [618700.0, 6920000.0], [618600.0, 6920000.0], [618600.0, 6920100.0],[618700.0, 6920100.0], [618700.0, 6920000.0] ] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 3,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "Polygon"';
geojson += '      }';
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "Polygon",';
geojson += '        "coordinates":';
geojson += '        [ [ [618650.0, 6920050.0], [618550.0, 6920050.0], [618550.0, 6920150.0],[618650.0, 6920150.0], [618650.0, 6920050.0] ] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 7,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "Polygon2"';
geojson += '      }';
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "MultiPoint",';
geojson += '        "coordinates":';
geojson += '        [ [619500.0, 6920000.0], [619500.0, 6919900.0], [619600.0, 6919900.0],[619600.0, 6920000.0] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 5,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "MultiPoint"';
geojson += '      }';
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "MultiLineString",';
geojson += '        "coordinates":';
geojson += '        [ [ [619000.0, 6920000.0], [619100.0, 6920000.0], [619100.0, 6920100.0],[619000.0, 6920100.0], [619000.0, 6920000.0] ], ';
geojson += '		  [ [618900.0, 6920000.0], [618800.0, 6920000.0], [618800.0, 6920100.0],[618900.0, 6920100.0], [618900.0, 6920000.0] ] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 6,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "MultiLineString"';
geojson += '      }';
geojson += '    }';
geojson += '  ]';
geojson += '}';

var geojson2 = '';
geojson2 += '{';
geojson2 += '  "type": "FeatureCollection",';
geojson2 += '  "features": ';
geojson2 += '  [';
geojson2 += '    {';
geojson2 += '      "type": "Feature",';
geojson2 += '      "geometry":';
geojson2 += '      {';
geojson2 += '        "type": "MultiPolygon",';
geojson2 += '        "coordinates":';
geojson2 += '        [ [ [ [619200.0, 6920000.0], [619300.0, 6920000.0], [619300.0, 6920100.0],[619200.0, 6920100.0], [619200.0, 6920000.0] ] ], ';
geojson2 += '		  [ [ [619400.0, 6920000.0], [619400.0, 6920000.0], [619500.0, 6920100.0],[619500.0, 6920100.0], [619400.0, 6920000.0] ] ] ]';
geojson2 += '      },';
geojson2 += '      "properties":';
geojson2 += '      {';
geojson2 += '        "id": 8,';
geojson2 += '        "popupTitle": "Info",';
geojson2 += '        "popupText": "PopupLayer 2, MultiPolygon"';
geojson2 += '      }';
geojson2 += '    },';
geojson2 += '    { ';
geojson2 += '      "type": "Feature",';
geojson2 += '      "geometry": {"type": "Point", "coordinates": [617186.0, 6919295.0]},';
geojson2 += '      "properties":';
geojson2 += '      {';
geojson2 += '        "id": 9,';
geojson2 += '        "popupTitle": "Info",';
geojson2 += '        "popupText": "Popup Layer 2, Point"';
geojson2 += '      }';
geojson2 += '    }';
geojson2 += '  ]';
geojson2 += '}';
