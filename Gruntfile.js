module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    releasePath: 'release/<%= pkg.name %>-<%= pkg.version %>', 
    
    clean: ['<%= releasePath %>'],
    
    auto_install: {
      local: {}
    },
    
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: ['dev/*.html', 'src/main/javascript/**/*.js'],
        tasks: ['jshint:js'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js',
        options: {
            node: true,
            es3: true
        }
      },
      js: {
        src: ['src/main/javascript/**/*.js'],
        options: {
            browser: true,
            es3: true,
            '-W069': false, // do not require dot notation
            '-W065': false, // do not require parseInt radix
            '-W030': false, // allow bla && func() expressions
            // TODO: enable these to be even stricter about source code linting
            /*curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            unused: true,
            boss: true,
            eqnull: true,*/
            globals: {
                'Ext': true,
                'OpenLayers': true,
                'GeoExt': true,
                'OpenEMap': true
            }
        }
      }
    },
    
    sencha: {
      release: {
        command: [
            '-sdk bower_components/ext-4.2.1',
            'compile',
            '--classpath=src/main/javascript,bower_components/geoext2/src',
            'exclude -all', 'and',
            'include -namespace OpenEMap', 'and',
            'include -file src/main/javascript/OpenEMap.js', 'and',
            'concat --closure <%= releasePath %>/<%= pkg.name %>.min.js']
      },
      debug: {
        command: [
            '-sdk bower_components/ext-4.2.1',
            'compile',
            '--classpath=src/main/javascript,bower_components/geoext2/src',
            'exclude -all', 'and',
            'include -namespace OpenEMap', 'and',
            'include -file src/main/javascript/OpenEMap.js', 'and',
            'concat <%= releasePath %>/<%= pkg.name %>.debug.js']
      }
    },
    
    copy: {
        dist: {
            files: [
            { expand: true, src: ['index.html'], dest: '<%= releasePath %>' },
            { expand: true, src: ['index-with-config.html'], dest: '<%= releasePath %>' },
            { expand: true, src: ['resources/**'], dest: '<%= releasePath %>' },
            { expand: true, flatten: true, src: ['dev/config/**'], dest: '<%= releasePath %>/config' }
            ]        
        }
    },
    
    connect: {
        options: {
            base: ['./'],
            middleware: function (connect, options) {
             var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
             return [
                proxy,
                connect['static'](options.base[0]),
                connect.directory(options.base[0])
             ];
          }
        },
        proxies: [{
            context: '/search/lm',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/print',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }]
    }
    
  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sencha-build');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['auto_install', 'jshint']);
  grunt.registerTask('build', ['default', 'sencha:release']);
  grunt.registerTask('dist', ['clean', 'build', 'copy']);
  grunt.registerTask('devserver', ['default', 'configureProxies', 'connect', 'watch']);
};
