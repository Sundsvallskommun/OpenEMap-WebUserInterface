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
//@define OpenEMap
Ext.ns('OpenEMap');

/*Proj4js.defs["EPSG:3006"] = "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
Proj4js.defs["EPSG:3014"] = "+proj=tmerc +lat_0=0 +lon_0=17.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
*/
Ext.apply(OpenEMap, {
    /**
     * @property {string} 
     * Default user for calls to LM:s webservices
     */
    lmUser: 'sundsvall',
    /**
     * @property {string} 
     * Base path to be used for mapfish print servlet requests
     */
    basePathMapFish: '/print/pdf',
    /**
     * @property {string} 
     * Base path to be used for all AJAX requests against search-lm REST API
     */
    basePathLM: '/search/lm/',
    /**
     * @property {string} 
     * Base path to be used for all AJAX requests against Elasticsearch REST API
     */
    basePathES: '/search/es/',
    /**
     * @property {string} 
     * Base path to be used for all image resources
     */
    basePathImages: 'resources/images/',

    /**
     * @property {Object} 
     * WS paths to be used for AJAX requests
     */
    wsUrls: {
        basePath:   '/openemapadmin/',
        configs:    'configurations/configs',
        servers:    'settings/servers',
        layers:     'layers/layers',
        metadata:   'geometadata/getmetadatabyid', 
        metadata_abstract: 'geometadata/getabstractbyid'
    }
});

Ext.apply(OpenEMap, {
    /**
     * Wrapped Ext.Ajax.request method that applies base path and user
     */
    requestLM: function(config) {
        config.url = OpenEMap.basePathLM + config.url + '&lmuser=' + OpenEMap.lmUser;
        Ext.Ajax.request(config);
    }
});
