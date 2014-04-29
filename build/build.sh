#!/bin/sh

if [ -z "$1" ]; then
	echo 'missing specified package'
	exit
fi
echo "starting createing package" $1

mkdir $1
cd $1
cp ../../index.html ./
cp ../../index-with-config.html ./

#mkdir resources
#cd resources
#cp ../../resources/OpenEMap.css OpenEMap.css
cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/resources ./ 
cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/images ./

cd ..

echo "building openemap"
#sencha compile --classpath=src/main/javascript,ext-4.2.1/src,geoext2-2.0.0/src/GeoExt exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat build/$1/OpenEMap-all.js
sencha compile --classpath=../src/main/javascript,../ext-4.2.1/src,../geoext2-2.0.0/src/GeoExt exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and --closure concat $1/OpenEMap-all.js
echo "compressing..."

tar -zcf $1.tar.gz $1

echo "cleaning up"
rm -r $1

echo "done"
