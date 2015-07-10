module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    releasePath: 'release/<%= pkg.name %>-<%= pkg.version %>', 
    modulesStaticPath: '<%= pkg.modulesStaticPath %>', 
    
    clean: {
    	dist: {
	    	src: ['<%= releasePath %>', '<%= releasePath %>.zip']
    	},
    	module: {
	    	options: {force: true},
	    	src: ['<%= modulesStaticPath %>/<%= pkg.name %>']
	  	},
	  	doc: {
	  		src: ['<%= releasePath %>/doc']
	  	}
    },
    
    auto_install: {
      local: {}
    },
    
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: ['dev/*.html', 'src/main/javascript/**/*.js', 'proj4_defs.js'],
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
            'concat --closure <%= releasePath %>/<%= pkg.name %>-<%= pkg.version %>-min.js']
      },
      debug: {
        command: [
            '-sdk bower_components/ext-4.2.1',
            'compile',
            '--classpath=src/main/javascript,bower_components/geoext2/src',
            'exclude -all', 'and',
            'include -namespace OpenEMap', 'and',
            'concat <%= releasePath %>/<%= pkg.name %>-<%= pkg.version %>-debug.js']
      },
      geoext_release: {
        command: [
            '-sdk bower_components/ext-4.2.1',
            'compile',
            '--classpath=bower_components/geoext2/src',
            'exclude -all', 'and',
            'include -namespace GeoExt', 'and',
            'concat --closure bower_components/geoext2/release/geoext-all.js']
      },
      geoext_debug: {
        command: [
            '-sdk bower_components/ext-4.2.1',
            'compile',
            '--classpath=bower_components/geoext2/src',
            'exclude -all', 'and',
            'include -namespace GeoExt', 'and',
            'concat bower_components/geoext2/release/geoext-debug.js']
      }
    },
    
    copy: {
        dist: {
            files: [
	            { expand: true, src: ['index*.html'], dest: '<%= releasePath %>' },
	            { expand: true, src: ['default.json'], dest: '<%= releasePath %>' },
	            { expand: true, src: ['proj4_defs.js'], dest: '<%= releasePath %>' },
	            { expand: true, src: ['resources/**'], dest: '<%= releasePath %>' },
	            { expand: true, src: ['examples/**'], dest: '<%= releasePath %>' },
	            { expand: true, cwd: 'bower_components/ext-theme-oep/build/resources/', src: ['**'], dest: '<%= releasePath %>/lib/ext-theme-oep' },
	            { expand: false, src: ['bower_components/ext-4.2.1/ext-all.js'], dest: '<%= releasePath %>/lib/ext/ext-all.js' },
	            { expand: false, src: ['bower_components/ext-4.2.1/ext-all-debug.js'], dest: '<%= releasePath %>/lib/ext/ext-all-debug.js' },
	            { expand: false, src: ['bower_components/ext-4.2.1/ext-theme-neptune.js'], dest: '<%= releasePath %>/lib/ext/ext-theme-neptune.js' },
	            { expand: false, src: ['bower_components/ext-4.2.1/locale/ext-lang-sv_SE.js'], dest: '<%= releasePath %>/lib/ext/locale/ext-lang-sv_SE.js' },
	            { expand: false, src: ['bower_components/OpenLayers-2.13.1/OpenLayers.js'], dest: '<%= releasePath %>/lib/OpenLayers/OpenLayers.js' },
	            { expand: false, src: ['bower_components/OpenLayers-2.13.1/OpenLayers.debug.js'], dest: '<%= releasePath %>/lib/OpenLayers/OpenLayers.debug.js' },
	            { expand: true, cwd: 'bower_components/OpenLayers-2.13.1/', src: ['theme/**'], dest: '<%= releasePath %>/lib/OpenLayers/'},
	            { expand: false, src: ['bower_components/proj4/dist/proj4-compressed.js'], dest: '<%= releasePath %>/lib/proj4js/proj4-compressed.js' },
	            { expand: false, src: ['bower_components/es5-shim/es5-shim.min.js'], dest: '<%= releasePath %>/lib/es5-shim/es5-shim.min.js' },
	            { expand: false, src: ['bower_components/es5-shim/es5-shim.map'], dest: '<%= releasePath %>/lib/es5-shim/es5-shim.map' },
	            { expand: false, src: ['bower_components/geoext2/release/geoext-all.js'], dest: '<%= releasePath %>/lib/geoext/geoext-all.js'},
	            { expand: false, src: ['bower_components/geoext2/release/geoext-debug.js'], dest: '<%= releasePath %>/lib/geoext/geoext-debug.js'},
	            { expand: true, flatten: true, src: ['dev/config/**'], dest: '<%= releasePath %>/config' },
	            { expand: false, src: ['<%= releasePath %>/<%= pkg.name %>-<%= pkg.version %>-min.js'], dest: '<%= releasePath %>/<%= pkg.name %>-min.js' },
	            { expand: false, src: ['<%= releasePath %>/<%= pkg.name %>-<%= pkg.version %>-debug.js'], dest: '<%= releasePath %>/<%= pkg.name %>-debug.js' },
	            { expand: false, src: ['src/main/javascript/OpenEMap.js'], dest: '<%= releasePath %>/OpenEMap.js' }
            ]        
        },
        module: {
        	files: [
	            { expand: true, cwd: '<%= releasePath %>/', src: ['**'], dest: '<%= modulesStaticPath %>/<%= pkg.name %>' }
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
            context: '/search/es',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/geoserver/wms',
            host: 'extmaptest.sundsvall.se',
            https: true,
            port: 443
        }, {
            context: '/print',
            host: 'localhost',
            https: false,
            port: 8080
        }, {
            context: '/openemappermalink',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/mapfishprint-2.1.0',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/openemapadmin',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/openemapadmin-1.6.0-rc.4',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }, {
            context: '/cgi-bin/proxy.py?url=',
            host: 'kartatest.e-tjansteportalen.se',
            https: true,
            port: 443
        }]
    },
    
    compress: {
      main: {
        options: {
          archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [
          { expand: true, cwd: '<%= releasePath %>', src: ['**'] }
        ]
      }
    },

	jsduck: {
	    main: {
	        // source paths with your code
	        src: [
	            'src/main/javascript', 'src/main/javascript/OpenEMap.js'
	        ],
	
	        // docs output dir
	        dest: 'doc/<%= pkg.name %>-<%= pkg.version %>',
	
	        // extra options
	        options: {
	            'builtin-classes': true,
	            'warnings': ['-no_doc', '-dup_member', '-link_ambiguous', '-no_doc_member', '-link', '-type_name', '-all:jsduck.categories'],
	            'external': ['XMLHttpRequest', 'OpenLayers.*'],
				'title' : 'Open eMap documentation',
				'ignore-html': [
					'locale',
					'debug'
				],
				'images': ['doc/img']
	        }
	    }
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
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jsduck');
  
  grunt.registerTask('default', ['auto_install', 'jshint']);
  grunt.registerTask('buildall', ['default', 'sencha:release', 'sencha:debug', 'sencha:geoext_release', 'sencha:geoext_debug'] );
  grunt.registerTask('build', ['default', 'sencha:release', 'sencha:debug'] );
  grunt.registerTask('copydist', ['copy:dist', 'compress']);
  grunt.registerTask('copytomodule', ['clean:module', 'copy:module']);
  grunt.registerTask('dist', ['clean:dist', 'build', 'copydist']);
  grunt.registerTask('distall', ['clean:dist', 'buildall', 'copydist']);
  grunt.registerTask('devserver', ['default', 'configureProxies', 'connect', 'watch']);
  grunt.registerTask('doc', ['clean:doc', 'jsduck']);
  
};
