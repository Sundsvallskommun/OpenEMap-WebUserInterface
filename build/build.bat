set release_name=OpenEMap-1.3.0-rc.3
echo ..\release\%release_name%
cd ..\release
rd /s /q %release_name%
del %release_name%.zip
del ..\%release_name%-all.js
del ..\%release_name%-all-debug.js
md %release_name%
cd %release_name%
md config
md resources
md examples
cd..
sencha.exe compile --classpath=..\src\main\javascript,..\..\libs\ext-4.2.1\src,..\..\libs\geoext-2.0.1\src exclude -all and include -namespace OpenEMap and include -file ..\src\main\javascript\OpenEMap.js and concat --closure ..\%release_name%-all.js
sencha.exe compile --classpath=..\src\main\javascript,..\..\libs\ext-4.2.1\src,..\..\libs\geoext-2.0.1\src exclude -all and include -namespace OpenEMap and include -file ..\src\main\javascript\OpenEMap.js and concat ..\%release_name%-all-debug.js
jsduck-5.3.4 --config ..\jsduck\jsduck.config --categories ..\jsduck\jsduck.categories --output %release_name%\doc
copy ..\*.html ..\release\%release_name%
copy ..\%release_name%-all.js ..\release\%release_name%
xcopy ..\examples %release_name%\examples /E
xcopy ..\resources %release_name%\resources /E
7z a -tzip %release_name%.zip -r %release_name%
pause