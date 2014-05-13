@echo off 
set release_name=OpenEMap-1.0.3.6
echo ..\release\%release_name%
cd ..\release
md %release_name%
cd %release_name%
md config
md resources
cd..
"C:\Program Files (x86)\Sencha\Sencha\Cmd\4.0.4.84\sencha.exe" compile --classpath=..\src\main\javascript,\libs\ext-4.2.1\src,\libs\geoext-2.0.1\src exclude -all and include -namespace OpenEMap and include -file ..\src\main\javascript\OpenEMap.js and concat --closure ..\OpenEMap-all.js
"C:\Program Files (x86)\Sencha\Sencha\Cmd\4.0.4.84\sencha.exe" compile --classpath=..\src\main\javascript,\libs\ext-4.2.1\src,\libs\geoext-2.0.1\src exclude -all and include -namespace OpenEMap and include -file ..\src\main\javascript\OpenEMap.js and concat ..\OpenEMap-debug-all.js
copy ..\*.html ..\release\%release_name%
copy ..\OpenEMap-all.js ..\release\%release_name%\OpenEMap-all.js
xcopy ..\config ..\release\%release_name%\config /E
xcopy ..\resources ..\release\%release_name%\resources /E
more
  
