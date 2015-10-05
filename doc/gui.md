# MapClient integration configuration
## Options object reference 
Complete reference for possible settings for options when creating client object
```json
"options" : {
	"gui" : {
		"map" : { Set_to_false_to_make_map_create_its_own_div,_otherwise_renderTo_must_be_specified
			"renderTo" : "divToRenderTo" Optional
		},
		"toolbar" : { Optional._Use_to_show_toolbar
			"renderTo" : "divToRenderTo" Optional
		},
		"zoomTools" : { Optional._Use_to_show_zoomTools
			"renderTo" : "divToRenderTo" Optional
		},
		"layers" : { Optional._Use_to_show_layers_control
			"renderTo" : "divToRenderTo", Optional
			"type": "basic", basic,_listconfigs_or_advanced,_description_below  
			"legendDelay": 0 specifies_how_long_time_in_millisecond_the_legend_image_popup_will_show_before_it_hides._Default_is_5000._Set_to_0_to_make_it_stay_until_user_closes_it
		},
		"baseLayers" : { Optional._Use_to_show_baseLayers_control
					"renderTo" : "divToRenderTo" Optional
		},
		"searchFastighet" : { Optional._Use_to_show_search_control
			"renderTo" : "divToRenderTo" Optional
		},
		"searchCoordinate": { Optional._Use_to_show_search_coordinate_control
			"renderTo": "searchcoordinate"}, Required
		"scalebar" : { Optional._Use_to_show_scalebar
			"renderTo" : "divToRenderTo" Optional
		},
		"showCoordinate": { Optional. Use_to_show_coordinates_for_mouse_pointer
			"renderTo": "showcoordinate" required
		}
	},
	"OpenEMap" : { Global_constants_to_set_where_to_find_different_services_and_resources
		"basePathImages" : "../resources/images/",
		"basePathMapFish" : "/mapfishprint-2.1.1/pdf", Base_path_to_be_used_for_mapfish_print_servlet_requests
		"basePathLM" : "/search/lm/", Base_path_to_be_used_for_all_AJAX_requests_against_search-lm_REST_API
		"lmUser" : "sundsvall", name_of_user_to_be_used_when_calling_search-lm_REST_API
		"basePathES" : "/search/es/", Base_path_to_be_used_for_all_AJAX_requests_against_Elasticsearch_REST_API
		"wmsURLs" : { URL/paths_related_to_WMS_usage_/_advanced_layer_list
			"basePath" : "/geoserver/wms",  URL_to_be_used_to_fetch_WMS_capabilities_etc._for_add_layer
			"url" : "https:extmaptest.sundsvall.se/geoserver/wms", URL_to_be_used_when_WMS_layer_has_been_added_to_config
			"getCapabilities" : "https:extmaptest.sundsvall.se/getcapabilities/wms.xml" URL_to_getcapabilities_document._Must_include_request_parameter_(eg._https:extmap.sundsvall.se/geoserver/wms?request=GetCapabilities&version=1.1.1)
		},
		"basePathProxy" : "/cgi-bin/proxy.py?url=", Base_path_to_proxy_to_be_used_for_WFS-post
		"wsUrls" : { WS_paths_to_be_used_for_AJAX_requests
			"basePath" : "/openemapadmin", basepath_to_Open_eMap_Admin
			"configs" : "/configs", relative_path_to_configs,_set_in_admin_of_modules_in_OpenHierarchy
			"adminconfigs" : "/adminconfigs", relative_path_to_adminconfigs,_set_in_admin_of_modules_in_OpenHierarchy
			"permalinks"" : "/openemappermalink/permalinks", path_to_permalinks
			"metadata" : "geometadata/getmetadatabyid",
			"metadata_abstract" : "geometadata/getabstractbyid"
		}
	}
};
```

## Layers control
Details for the layers control
### basic
Shows a basic layers control without possibility to add layers or saving config
### listconfigs
Shows the layers control including list of my maps and public maps, and the possibility to save map, but without add layer control 
### advanced
Shows the layers control including all functionality including list of my maps and public maps, possibility to save map, and add layer control 
