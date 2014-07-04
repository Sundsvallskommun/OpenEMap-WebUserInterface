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
Ext.define('OpenEMap.view.MetadataWindow' ,{
	extend: 'Ext.Window',

    requires: [
        'Ext.tab.Panel'
    ],

	title: 'Metadata',
	width: 600,
	height: 500,
	border: 0,
    layout: 'fit',
	closeAction: 'hide',

    /**
    * Translation constant
    */
    TRANSLATION: {
        sv: {
            tag: {
                // Hide some elements
                'gmd:citation': '',
                'gmd:CI_Address': '',
                'gmd:CI_Citation': '',
                'gmd:CI_Contact': '',
                'gmd:CI_Date': '',
                'gmd:CI_Telephone': '',
                'gmd:CI_ResponsibleParty': '',
                'gmd:identificationInfo': '',
                'gmd:EX_BoundingPolygon': '',
                'gmd:EX_Extent': '',
                'gmd:EX_GeographicBoundingBox': '',
                'gmd:EX_GeographicDescription': '',
                'gmd:EX_TemporalExtent': '',
                'gmd:EX_VerticalExtent': '',
                'gmd:MD_BrowseGraphic': '',
                'gmd:MD_Constraints': '',
                'gmd:MD_Identifier': '',
                'gmd:MD_Keywords': '',
                'gmd:MD_LegalConstraints': '',
                'gmd:MD_Metadata': '',
                'gmd:MD_MaintenanceInformation': '',
                'gmd:MD_SecurityConstraints': '',
                'gmd:thesaurusName': '',
                'gmd:voice': '',
                'srv:SV_ServiceIdentification': '',

                // Swedish translation
                'gmd:accessConstraints': 'Nyttjanderestriktioner',
                'gmd:abstract': 'Sammanfattning',
                'gmd:address': 'Adress',
                'gmd:alternateTitle': 'Alternativ titel',
                'gmd:city': 'Stad',
                'gmd:classification': 'Klassificering',
                'gmd:contact': 'Metadatakontakt',
                'gmd:contactInfo': 'Kontaktinformation',
                'gmd:date': 'Datum',
                'gmd:dateStamp': 'Datum',
                'gmd:dateType': 'Datumtyp',
                'gmd:descriptiveKeywords': 'Nyckelordslista',
                'gmd:electronicMailAddress': 'E-post',
                'gmd:fileIdentifier': 'Identifierare för metadatamängden',
                'gmd:graphicOverview': 'Exempelbild',
                'gmd:hierarchyLevel': 'Hierarkisk nivå (Resurstyp)',
                'gmd:individualName': 'Person',
                'gmd:identifier': 'Identifierare',
                'gmd:keyword': 'Nyckelord',
                'gmd:language': 'Språk',
                'gmd:metadataStandardName': 'Metadatastandardversion',
                'gmd:metadataStandardVersion': 'Metadatastandard',
                'gmd:organisationName': 'Organisation',
                'gmd:otherConstraints': 'Andra restriktioner',
                'gmd:phone': 'Telefonnummer',
                'gmd:pointOfContact': 'Kontakt',
                'gmd:resourceConstraints': 'Restriktioner och begränsningar',
                'gmd:role': 'Ansvarsområde',
                'gmd:status': 'Status',
                'gmd:title': 'Titel',
                'gmd:type': 'Typ',
                'gmd:useLimitation': 'Användbarhetsbegränsningar'
            },
            codeListValue: {
                'swe': 'Svenska',
                'service': 'Tjänst',
                'pointOfContact': 'Kontakt'
            }
        }
    },

    /**
    * Init component
    */
    initComponent : function() {
        
        this.overviewTab = new Ext.Panel ({
            title: 'Översikt'
        });

        this.metadataTab = new Ext.Panel ({
            title: 'Information om metadata'
        });

        this.dataTab = new Ext.Panel ({
            title: 'Information om data'
        });
      
        this.qualityTab = new Ext.Panel ({
            title: 'Kvalitet'
        });

        this.distributionTab = new Ext.Panel ({
            title: 'Distribution'
        });

        this.restTab = new Ext.Panel ({
            title: 'Rest'
        });

        this.items = Ext.create('Ext.tab.Panel', {
            activeTab: 0,
            defaults: {
                autoScroll: true
            },
            items: [
                this.overviewTab,
                this.metadataTab,
                this.dataTab,
                this.qualityTab,
                this.distributionTab,
                this.restTab
            ]
        });

        this.callParent(arguments);
    },

    /**
    * Render metadata into tab-panel for specific UUID
    * @param {string}   UUID    metadata uuid
    */
	showMetadata: function(UUID) {
		var me = this;
		this.dataHandler.getMetadata(UUID, function(json) {
			if(json.children) {
                var result = me.parseMetadata(json.children);
                me.overviewTab.html = result.overview;
    			me.metadataTab.html = result.metadata_info;
                me.dataTab.html = result.data_info;
                me.qualityTab.html = result.quality;
                me.distributionTab.html = result.distribution;
                me.restTab.html = result.rest;
    			me.show();
            }
		});
	},



    /**
    * Try to translate value of specific type
    * @param {string}   type    tag-type
    * @param {string}   value   value to translate
    */
    translate: function(type, value) {
        var language = 'sv';
        var traslatedTag = null;
        try {
            traslatedTag = this.TRANSLATION[language][type][value];
            if(typeof traslatedTag !== 'string') {
                traslatedTag = value;
            }
        }
        catch(err) {
            translateTag = null;
        }
        return traslatedTag;
        
    },

    /**
    * Parse text element for specific node
    * @param {object}   node    xml-node
    */
    parseMetadataTextTag: function (node) {
        var text = null;
        if(node.tag) {
            var text = this.translate('tag', node.tag);
            text = (text !== null) ? (text !== '' ? '<b>' + text + '</b>' : '') : null;
        }
        if(node.text) {
            text = node.text;
        }
        if(node.attributes) {
            if(node.attributes.codeListValue) {
                text = this.translate('codeListValue',node.attributes.codeListValue);
            }
        }
        
        return text;
    },

    /**
    * Get groups for specific metadata node key. If no matching group place it in rest.
    * @param {string}   str         string to group
    * @param {object}   group_by    object to group by
    **/
    getGroups: function(str, group_by) {
        var groups = [];
        for (key in group_by) {
            for (var i = 0; i < group_by[key].length; i++) {
                if(str.indexOf(group_by[key][i]) !== -1) {
                    groups.push(key);
                }
            };
        };
        if(groups.length === 0) {
            groups.push('rest');
        }
        return groups;
    },

    /**
    * Iterates over metadata json to convert to renderable html
    * @param {object}   node            xml-node
    * @param {object}   result          resulting object
    * @param {object}   group_by        object to group by
    * @param {string}   parent_node_tag parent tag name
    */
    metadataIterator: function(node, result, group_by, parent_node_tag) {
        // Node tag
        var nodeTag = this.parseMetadataTextTag(node);
        // Current node identifier
        var currentTag = (typeof parent_node_tag !== 'undefined' ? (parent_node_tag + '>') : '') + node.tag;
        // Goups to include tag in
        var groups = this.getGroups(currentTag, group_by);
        // For each group
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if(typeof result[group] !== 'string') {
                result[group] = '';
            }

            if(nodeTag !== null) {
                result[group] += '<li>';
                result[group] += nodeTag;

                // Loop over child nodes
                if(node.children && i === 0) {
                    result[group] += nodeTag !== '' ? '<ul>' : '';
                    for (var j = 0; j < node.children.length; j++) {
                        this.metadataIterator(node.children[j], result, group_by, currentTag);
                    }
                    result[group] += nodeTag !== '' ? '</ul>' : '';
                }

                result[group] += '</li>';
            }
        };
    },

    /**
    * Parse metadata-json-response into html
    * @param  {object}   json    json response object
    * @return {object}   result  grouped result object  
    */
    parseMetadata: function(json) {
        var result = {};
        // Group metadata to prepare to show in tabs
        var group_by = {
            overview: [
                'gmd:MD_Metadata>gmd:identificationInfo>srv:SV_ServiceIdentification>gmd:citation>gmd:CI_Citation>gmd:title',
                'gmd:MD_Metadata>gmd:identificationInfo>srv:SV_ServiceIdentification>gmd:abstract',
                'gmd:MD_Metadata>gmd:identificationInfo>srv:SV_ServiceIdentification>gmd:descriptiveKeywords',
                'gmd:MD_Metadata>gmd:identificationInfo>srv:SV_ServiceIdentification>gmd:graphicOverview'
            ],
            metadata_info: [
                'gmd:MD_Metadata>gmd:fileIdentifier',
                'gmd:MD_Metadata>gmd:language',
                'gmd:MD_Metadata>gmd:dateStamp',
                'gmd:MD_Metadata>gmd:hierarchyLevel',
                'gmd:MD_Metadata>gmd:metadataStandardName',
                'gmd:MD_Metadata>gmd:metadataStandardVersion',
                'gmd:MD_Metadata>gmd:contact'
            ],
            data_info: [
                'gmd:MD_Metadata>gmd:identificationInfo'
            ],
            quality: [
                'gmd:MD_Metadata>gmd:dataQualityInfo'
            ],
            distribution: [
                'gmd:MD_Metadata>gmd:distributionInfo'
            ]
        };

        // Iterate over metadata to render html
    	this.metadataIterator(json[0], result, group_by);
        return result;
    }
});