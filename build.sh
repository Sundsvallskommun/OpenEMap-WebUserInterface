#!/bin/sh
sencha compile --classpath=src/main/javascript,ext-4.2.1/src,geoext2/src exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat --closure OpenEMap-all.js
sencha compile --classpath=src/main/javascript,ext-4.2.1/src,geoext2/src exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat OpenEMap-debug-all.js
cp geoext2/geoext2-all.js geoext2-all.js
cp OpenEMap-all.js src/main/webapp/OpenEMap-all.js
cp -r src/main/webapp/config ./
cp -r src/main/webapp/resources ./
rm OpenEMap-1.0.0.zip
zip -r -q OpenEMap-1.0.0.zip \
  OpenEMap-all.js \
  OpenEMap-debug-all.js \
  es5-shim.min.js \
  OpenLayers-2.13.1/OpenLayers.js \
  OpenLayers-2.13.1/theme/* \
  OpenLayers-2.13.1/img/* \
  ext-4.2.1/ext-all.js \
  ext-4.2.1/ext-theme-oep.js \
  ext-4.2.1/resources/css/* \
  ext-4.2.1/resources/ext-theme-oep/* \
  ext-4.2.1/locale/ext-lang-sv_SE.js \
  geoext2-all.js \
  resources/* \
  config/* \
  README.md
  
