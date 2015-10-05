<a href="http://oemap.org"><img alt="Open eMap homepage" src="http://oemap.org/images/logo.png"></a>
# OpenEMap WUI

Configurable map viewer

Based on Ext JS 4, GeoExt 2 and OpenLayers 2.13.1 and built as an Ext JS application named OpenEMap.

## Integration

Integrate into HTML page using the following snippet:

```html
    <script type="text/javascript">
    var debug='source'; // Use 'debugbuild' to use not minified files
    var devPath = ''; // makes it possible to set a relative path for html-file
    </script> 

    <script type="text/javascript" src="OpenEMap.js"></script>
    
    <script type="text/javascript">
		var configUrl = '/openemapadmin-1.6.0-rc.3/adminconfigs/config/' + id;
		
		// Optional callback to run after Open eMap is initialized
		var callback = function(mapClient) { 
			// code to run after Open eMap is initialized
		}
		var options = {
			gui: {
				map : {renderTo: 'map'},
				toolbar : {},
				zoomTools : {},
				layers : {},
				baseLayers : {},
				searchFastighet : {}
			}
		};
		
		initOpenEMap(configUrl, options, callback)
    </script>
    
	<div id="map" style="position: absolute; width: 100%; height: 100%;" class="popup"></div>
```

NOTE: The above snippet uses build including all dependencies
See [options object reference](/doc/gui.md) for complete reference

## Homepage
<a href="http://oemap.org"><img alt="Open eMap homepage" src="http://oemap.org/images/logo.png"></a>

## Documentation
###API Docs 
####[1.6.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.6.0/)
####[1.5.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.5.0/)
####[1.3.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.3.0/)
####[1.2.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.2.0/)
####[1.1.0](http://oemap.org/doc/OpenEMapWebUserInterface/1.1.0/)

## Development

Requirements:

* Install Git client (eg [http://git-scm.com/](http://git-scm.com/))
* Clone repo using git (eg. `git clone https://github.com/Sundsvallskommun/OpenEMap-WebUserInterface) OpenEMap-WebUserInterface` 
* Install [Node JS](https://nodejs.org/) >0.10 
* cd into the directory of the repo (eg `cd OpenEMap-WebUserInterface`)
* Grunt CLI (install with `npm -g install grunt-cli`)
* Bower (install with `npm -g install bower`)

A fresh clone of the repository will require running `npm install` in its root. After that you can start devserver on `http://localhost:8000` by running `grunt devserver`. A development example should be runnable at `http://localhost:8000/dev/debug.html`. Changes to any source file will in the debug version automatically reload the page.

###Documentation
Source code should be documented using [JSDucks](https://github.com/senchalabs/jsduck/wiki) semantics
Readme.md should be updated if necessary
Map config is documented in doc/config.md, and should be updated if cahnges is made in map config
Each release is documented under Releases/Release number (see versioning below) 

## Building a release verison

Done by running `grunt distall` in a working development clone. Requires Sencha Cmd installed and available on the path.

## Versioning

Versioning should follow [Semantic versioning 2.00](http://semver.org/)
This semantic starts at version 1.1.0-rc.1 (MAJOR.MINOR.PATCH-PRERELEASE)
Versioning uses the GitFlow model. Release branches are created as soon as a feature freeze is decided, and should be created for each new version with status of MAJOR, MINOR or PATCH. Pre releases are made within their respective release branch.

## License

Open eMap Web User Interface is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.html) for more details.
