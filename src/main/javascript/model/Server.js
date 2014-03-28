/**
 * Server configuration model
 */

Ext.define('OpenEMap.model.Server' ,{
    extend: 'Ext.data.Model',

    fields: [ 
    	'id', 
    	'type',
    	'url',
    	'proxy'
    ]

});