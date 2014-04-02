#!/bin/sh

if [ -z "$1" ]; then
	echo 'missing specified package'
	exit
fi
echo "starting createing package" $1

mkdir $1
cd $1
cp ~/Sites/6603517000-riges/OpenEMap-integrations/index.html ./
cp ~/Sites/6603517000-riges/OpenEMap-integrations/es5-shim.min.js ./
cp ~/Sites/6603517000-riges/OpenEMap-integrations/geoext2-all.js ./

mkdir resources
cd resources
cp ~/Sites/6603517000-riges/OpenEMap-integrations/resources/OpenEMap.css OpenEMap.css
cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/ext-theme-oep ./
cp -r ~/Sites/6603517000-riges/OpenEMap-integrations/resources/resources ./ 

cd ../../

echo "building openemap"
sencha compile --classpath=src/main/javascript,ext-4.2.1/src,geoext2/src exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat --closure $1/OpenEMap-all.js

echo "compressing..."
tar -zcf $1.tar.gz $1

echo "cleaning up"
rm -r $1

echo "done"
