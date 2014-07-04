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
 * Data handler, handles ajax-request against ws-backend
 * Used when no store is associated with the data
 */

Ext.define('OpenEMap.data.DataHandler', {

    metadataAbstractWsUrl: null,
    metadataWsUrl: null,
    layersWsUrl: null,

    metadataAbstractCache: {},
    
    constructor: function(options) {
        this.wsUrls = OpenEMap.wsUrls;
        Ext.apply(this,options);
    },

    /**
    * GET-request to get a specific layer
    * @param {number}   id          layer id
    * @param {Function} callback    callback-function on success
    */
    getLayer: function(id, callback) {
        if(this.wsUrls.layers && id) {
            this.doRequest(
                {
                    url: this.wsUrls.basePath + this.wsUrls.layers + '/' + id
                },
                function(json) {
                    callback(json);
                }
            );
        }
    },


    /**
    * GET-request to get layers
    * @param {Function} callback    callback-function on success
    */
    getLayers: function(callback) {
        if(this.wsUrls.layers) {
            this.doRequest(
                {
                    url: this.wsUrls.basePath + this.wsUrls.layers
                },
                callback
            );
        }
    },

    /**
    * GET-request to get metadata for specific UUID
    * @param {string}   UUID        layer metadata UUID
    * @param {Function} callback    callback-function on success
    */
    getMetadata: function(UUID, callback) {
        if(UUID && this.wsUrls.metadata) {
            this.doRequest(
                {
                    url: this.wsUrls.basePath + this.wsUrls.metadata + '/' + UUID
                },
                callback
            );
        }
    },

    /**
    * GET-request to get metadata abstract for specific UUID
    * @param {string}   UUID        layer metadata UUID
    * @param {Function} callback    callback-function on success
    */
    getMetadataAbstract: function(UUID, callback) {
        if(UUID && this.wsUrls.metadata_abstract) {
            var me = this;
            // Cache metadata temporarily until page reload, to minize ajax requests
            if(me.metadataAbstractCache[UUID]) {
                callback(me.metadataAbstractCache[UUID]);
            } else {
                this.doRequest(
                    {
                        url: this.wsUrls.basePath + this.wsUrls.metadata_abstract + '/' + UUID
                    },
                    function(json) {
                        callback(json);
                        me.metadataAbstractCache[UUID] = json;
                    }
                );
            }
        }
    },

    /**
    * PUT-request to update a configuration
    * @param {number}   id         map configuration id
    * @param {Object}   conf       map config object
    * @param {Function} callback   callback-function on success
    */
    updateConfiguration: function(id, conf, callback) {
        this.doRequest({
            url: this.wsUrls.basePath + this.wsUrls.configs + '/' + id,
            method: 'PUT',
            jsonData: conf
        }, callback);
    },

    /**
    * POST-request to save a new configuration
    * @param {Object}   conf       map config object
    * @param {Function} callback   callback-function on success
    */
    saveNewConfiguration: function(conf, callback) {
        this.doRequest({
            url: this.wsUrls.basePath + this.wsUrls.configs,
            method: 'POST',
            jsonData: conf
        }, callback);
    },

    /**
    * DELETE-request to remove a configuration
    * @param {number}   id         map configuration id
    * @param {Object}   conf       map config object
    * @param {Function} callback   callback-function on success
    */
    deleteConfiguration: function(id, conf, callback) {
        this.doRequest({
            url: this.wsUrls.basePath + this.wsUrls.configs + '/' + id,
            method: 'DELETE',
            jsonData: conf
        }, callback);
    },

    /**
    * Handles Ajax-request.
    * @param {Object}   options     Ext.Ajax.request options 
    * @param {Function} callback    callback-function on success
    */
    doRequest: function(options, callback) {
        var me = this;
        if(options && (options.method && options.method === 'POST' && options.method === 'PUT') && !callback) {
            me.onFailure('no callback function');
            return false;
        };
        Ext.Ajax.request(Ext.apply({
                success: function(response) {
                    if(response && response.responseText) {
                        var json = Ext.decode(response.responseText);
                        if(callback) {
                            callback(json);
                        }
                    } else {
                        me.onFailure();
                    }
                },
                failure: function(e) {
                    me.onFailure(e.status + ' ' + e.statusText + ', ' + options.url);
                }
            }, (options ? options : {})));
    },

    /**
    * Called on ajax-request failure or data not correct
    * @param {string}   msg     error message
    */
    onFailure: function(msg) {
        //TODO! handle failure
        console.error(msg);
        //Ext.Error.raise(msg);
    }


});