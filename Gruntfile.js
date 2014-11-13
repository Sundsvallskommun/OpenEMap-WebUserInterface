module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    auto_install: {
      local: {}
    },
    
    sencha: {
      release: {
        //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        command: ['-sdk ../ext-4.2.1.883 compile --classpath=src/main/javascript,bower_components/geoext2/src exclude -all and include -namespace OpenEMap and include -file src/main/javascript/OpenEMap.js and concat --closure <%= pkg.name %>-all.js']
      },
      debug: {
        //src: 'src/<%= pkg.name %>.js',
        //dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-sencha-build');

  grunt.registerTask('default', ['auto_install', 'sencha:release']);
};
