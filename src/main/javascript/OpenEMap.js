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

Ext.apply(OpenEMap, {
    lmUser: 'sundsvall',
    /**
     * Base path to be used for mapfish print servlet requests
     * 
     * @property {string}
     */
    basePathMapFish: '/print/pdf',
    /**
     * Base path to be used for all AJAX requests against search-lm REST API
     * 
     * @property {string}
     */
    basePathLM: '/search/lm/',
    /**
     * Base path to be used for all image resources
     * 
     * @property {string}
     */
    basePathImages: 'resources/images/',

    /**
     * WS paths to be used for AJAX requests
     * 
     * @property {object}
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
