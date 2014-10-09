var matchdep = require('matchdep'),
    tmp      = require('temporary');

module.exports = function (grunt) {
  'use strict';

  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var tmpDir = new tmp.Dir();

  grunt.initConfig({

    /* project configuration */

    pkg: grunt.file.readJSON('package.json'),

    prj: {
      src: 'src',
      build: 'build',
      release: 'release',
      dist: 'dist',

      buildTemplates: 'build_templates',
      test: 'test',
      fixtures: 'fixtures',
      vendor: 'bower_components',

      dependencies: [
        '<%= prj.vendor %>/lodash/dist/lodash.min.js',
        '<%= prj.vendor %>/angular/angular.min.js',
        '<%= prj.vendor %>/angular-bootstrap/ui-bootstrap-tpls.min.js',
        '<%= prj.vendor %>/angular-ui-router/release/angular-ui-router.min.js'
      ],

      cssDependencies: [
      ],

      devDependencies: [
        '<%= prj.vendor %>/angular-mocks/angular-mocks.js'
      ],

      css: {
        src: '<%= prj.src %>/less',
        build: '<%= prj.build %>/<%= prj.src %>/css',
        release: '<%= prj.release %>/css'
      },

      js: {
        src: '<%= prj.src %>',
        build: '<%= prj.build %>/<%= prj.src %>',
        release: '<%= prj.release %>'
      },

      assets: {
        src: '<%= prj.src %>/assets',
        build: '<%= prj.build %>/<%= prj.src %>/assets',
        release: '<%= prj.release %>/assets'
      }
    },

    /* build tasks */

    clean: {
      build: ['<%= prj.build %>'],
      release: ['<%= prj.release %>'],
      dist: ['<%= prj.dist %>']
    },

    html2js: {
      partials: {
        options: {
          module: 'partials'
        },
        src: ['<%= prj.src %>/**/*.html'],
        dest: '<%= prj.js.build %>/partials.js'
      }
    },

    less: {
      options: {
        sourceMap: true
      },
      common: {
        options: {
          sourceMapFilename: '<%= prj.css.build %>/common.css.map',
          sourceMapURL: 'common.css.map'
        },
        src: ['<%= prj.css.src %>/oocss.common.less'],
        dest: '<%= prj.css.build %>/common.css'
      },
      product: {
        options: {
          sourceMapFilename: '<%= prj.css.build %>/product.css.map',
          sourceMapURL: 'product.css.map'
        },
        src: ['<%= prj.css.src %>/oocss.products.less'],
        dest: '<%= prj.css.build %>/product.css'
      },
      patch: {
        options: {
          sourceMapFilename: '<%= prj.css.build %>/patch.css.map',
          sourceMapURL: 'patch.css.map'
        },
        src: ['<%= prj.css.src %>/patch.less'],
        dest: '<%= prj.css.build %>/patch.css'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      scripts: {
        src: ['<%= prj.js.src %>/**/*.js']
      },
      tests: {
        src: ['<%= prj.test %>/**/*.js']
      }
    },

    /* release tasks */

    cssmin: {
      styles: {
        src: [
          '<%= less.common.dest %>',
          '<%= less.product.dest %>',
          '<%= less.patch.dest %>',
          '<%= prj.css.src %>/**/*.css'
        ],
        dest: '<%= prj.css.release %>/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },

    concat: {
      srcScripts: {
        src: ['<%= prj.js.build %>/**/*.js'],
        dest: '<%= prj.js.release %>/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      scripts: {
        src: [
          '<%= prj.dependencies %>',
          '<%= concat.srcScripts.dest %>'
        ],
        dest: '<%= concat.srcScripts.dest %>'
      },
      styles: {
        src: [
          '<%= prj.cssDependencies %>',
          '<%= cssmin.styles.dest %>'
        ],
        dest: '<%= cssmin.styles.dest %>'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      sources: {
        src: ['<%= concat.srcScripts.dest %>'],
        dest: '<%= concat.srcScripts.dest %>'
      }
    },

    uglify: {
      options: {
        mangle: true
      },
      sources: {
        src: ['<%= concat.srcScripts.dest %>'],
        dest: '<%= concat.srcScripts.dest %>'
      }
    },

    compress: {
      release: {
        options: {
          archive: '<%= prj.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: '<%= prj.release %>/',
        src: ['**']
      }
    },

    /* build/release tasks */

    index: {
      build: {
        dir: '<%= prj.build %>',
        src: [
          '<%= prj.cssDependencies %>',
          '<%= cssmin.styles.src %>',
          '<%= prj.dependencies %>',
          '<%= concat.srcScripts.src %>'
        ]
      },
      release: {
        dir: '<%= prj.release %>',
        src: [
          '<%= concat.scripts.dest %>',
          '<%= concat.styles.dest %>'
        ]
      }
    },

    copy: {
      build_scripts: {
        src: ['<%= jshint.scripts.src %>'],
        dest: '<%= prj.build %>/'
      },
      build_dependencies: {
        src: ['<%= prj.dependencies %>'],
        dest: '<%= prj.build %>/'
      },
      build_cssDependencies: {
        src: ['<%= prj.cssDependencies %>'],
        dest: '<%= prj.build %>/'
      },
      build_assets: {
        expand: true,
        cwd: '<%= prj.assets.src %>/',
        src: ['**'],
        dest: '<%= prj.assets.build %>/'
      },
      release_assets: {
        expand: true,
        cwd: '<%= prj.assets.build %>/',
        src: ['**'],
        dest: '<%= prj.assets.release %>'
      }
    },

    karma: {
      options: {
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        plugins: [
          'karma-jasmine',
          'karma-phantomjs-launcher',
          'karma-junit-reporter',
          'karma-coverage'
        ],
        files: [
          '<%= prj.dependencies %>',
          '<%= prj.devDependencies %>',
          '<%= jshint.scripts.src %>',
          '<%= jshint.tests.src %>'
        ],
        preprocessors: {
          '<%= jshint.scripts.src %>': 'coverage'
        },
        singleRun: true
      },
      build: {
        reporters: [
          'dots',
          'coverage'
        ],
        coverageReporter: {
          type: 'text-summary',
          dir: tmpDir.path
        }
      },
      release: {
        reporters: [
          'junit',
          'coverage'
        ],
        junitReporter: {
          outputFile: '<%= prj.dist %>/test-results.xml'
        },
        coverageReporter: {
          type: 'lcov',
          dir: '<%= prj.dist %>/coverage/'
        }
      }
    },

    /* dev tasks */

    freddie: {
      build: {
        options: {
          root: '<%= prj.build %>',
          port: 3000,
          fixtures: {
            '/api': '<%= prj.fixtures %>'
          }
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['<%= jshint.scripts.src %>'],
        tasks: ['jshint:scripts', 'karma:build', 'copy:build_scripts']
      },
      assets: {
        files: ['<%= prj.assets.src %>/**'],
        tasks: ['copy:build_assets']
      },
      partials: {
        files: ['<%= html2js.partials.src %>'],
        tasks: ['html2js']
      },
      less: {
        files: ['<%= prj.css.src %>/**/*.less'],
        tasks: ['less']
      },
      tests: {
        files: ['<%= jshint.tests.src %>'],
        tasks: ['jshint:tests', 'karma:build']
      }
    }
  });

  /* main tasks */

  grunt.registerTask('compile', [
    'html2js',
    'less',
    'copy:build_scripts',
    'copy:build_dependencies',
    'copy:build_cssDependencies',
    'copy:build_assets'
  ]);

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'karma:build',
    'compile',
    'index:build'
  ]);

  grunt.registerTask('dev', [
    'build',
    'freddie',
    'watch'
  ]);

  grunt.registerTask('release', [
    'clean',
    'jshint',
    'karma:release',
    'compile',
    'cssmin',
    'copy:release_assets',
    'concat:srcScripts',
    'ngAnnotate',
    'uglify',
    'concat:scripts',
    'concat:styles',
    'index:release',
    'version',
    'compress'
  ]);

  grunt.registerTask('default', ['release']);

  /* custom task definitions */

  (function () {
    var ext = function (ext) {
      var extRE = new RegExp('\.' + ext + '$');
      return RegExp.prototype.test.bind(extRE);
    };

    var task = function () {
      var dir = this.data.dir,
          files = this.filesSrc;

      var relativePath = function (file) {
        return file.replace(dir + '/', '');
      };

      var scripts = files.filter(ext('js')).map(relativePath),
          styles = files.filter(ext('css')).map(relativePath),
          dev = grunt.task.current.target === 'build';

      var src = grunt.config('prj.buildTemplates') + '/index.html',
          dest = dir + '/index.html';

      grunt.file.copy(src, dest, {
        process: function (contents) {
          return grunt.template.process(contents, {
            data: {
              scripts: scripts,
              styles: styles,
              dev: dev
            }
          });
        }
      });
    };

    grunt.registerMultiTask('index', 'Process index template', task);
  })();

  (function () {
    var task = function () {
      var src = grunt.config('prj.buildTemplates') + '/version.txt',
          dest = grunt.config('prj.release') + '/version.txt';

      grunt.file.copy(src, dest, {
        process: function (contents) {
          return grunt.template.process(contents, {
            data: {
              pkg: grunt.config('pkg'),
              env: process.env
            }
          });
        }
      });
    };

    grunt.registerTask('version', 'Process version template', task);
  })();
};
