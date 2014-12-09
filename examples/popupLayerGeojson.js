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
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "Point"';
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
geojson += '        "popupTitle": "Info",';
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
geojson += '    },';
geojson += '    {';
geojson += '      "type": "Feature",';
geojson += '      "geometry":';
geojson += '      {';
geojson += '        "type": "MultiPolygon",';
geojson += '        "coordinates":';
geojson += '        [ [ [ [619200.0, 6920000.0], [619300.0, 6920000.0], [619300.0, 6920100.0],[619200.0, 6920100.0], [619200.0, 6920000.0] ] ], ';
geojson += '		  [ [ [619400.0, 6920000.0], [619400.0, 6920000.0], [619500.0, 6920100.0],[619500.0, 6920100.0], [619400.0, 6920000.0] ] ] ]';
geojson += '      },';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 8,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "MultiPolygon"';
geojson += '      }';
geojson += '    },';
geojson += '    { ';
geojson += '      "type": "Feature",';
geojson += '      "geometry": {"type": "Point", "coordinates": [618186.0, 6919295.0]},';
geojson += '      "properties":';
geojson += '      {';
geojson += '        "id": 9,';
geojson += '        "popupTitle": "Info",';
geojson += '        "popupText": "Point"';
geojson += '      }';
geojson += '    }';
geojson += '  ]';
geojson += '}';
