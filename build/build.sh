#!/bin/sh

if [ -z "$1" ]; then
	echo 'missing specified package'
	exit
fi
echo "starting createing package" $1

mkdir $1
cp ../index.html $1
cp ../index-with-config.html $1

mkdir $1
cp -r ../resources $1/resources
#cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/resources/ $1/resources
#cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/images/ $1/images


echo "building openemap"
#sencha compile --classpath=src/main/javascript,ext-4.2.1/src,geoext2-2.0.0/src/GeoExt exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat build/$1/OpenEMap-all.js

sencha compile --classpath=../src/main/javascript,../../libs/ext-4.2.1/src,../../geoext2-2.0.0/src/GeoExt exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat $1/OpenEMap-all-debug.js

sencha compile --classpath=../src/main/javascript,../../libs/ext-4.2.1/src,../../geoext2-2.0.0/src/GeoExt exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat -closure $1/OpenEMap-all.js
echo "compressing..."

tar -zcf $1.tar.gz $1

echo "cleaning up"
rm -r $1

echo "done"
