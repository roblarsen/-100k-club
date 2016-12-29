"use strict";
module.exports = function (grunt) {

  // Automatically load required Grunt tasks
  require("jit-grunt")(grunt, {
    useminPrepare: "grunt-usemin",
    ngtemplates: "grunt-angular-templates",
    sass:"grunt-sass",
    stringReplace: "grunt-string-replace"
  });
  grunt.initConfig({

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ["static/_assets/scripts/{,*/}*.js"],
        tasks: ["concurrent:lint"]

      },
      sass: {
        files: ["static/_assets/styles/scss/**"],
        tasks: ["sass"]

      },
      json: {
        files: ["static/data/books.dev.json","static/data/sa-pedigrees.dev.json"],
        tasks: ["minjson"]
      }
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                "static/_assets/styles/styles.css": "static/_assets/styles/scss/styles.scss",
                "static/_assets/styles/form.css": "static/_assets/styles/scss/form.scss"
            }
        }
    },
    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish")
      },
      all: {
        src: [
          "Gruntfile.js",
          "static/_assets/scripts/{,*/}*.js"
        ]
      }
		},

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: ".jscsrc",
        verbose: true
      },
      all: {
        src: [
          "Gruntfile.js",
          "static/_assets/scripts/static/{,*/}*.js"
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            ".tmp",
            "dist/{,*/}*",
            "!dist/.git{,*/}*"
          ]
        }]
      },
      server: ".tmp"
    },
    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require("autoprefixer-core")({browsers: ["last 1 version"]})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: ".tmp/concat/styles/",
          src: "{,*/}*.css",
          dest: ".tmp/concat/styles/"
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/concat/styles/",
          src: "{,*/}*.css",
          dest: ".tmp/concat/styles/"
        }]
      }
    },
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          "dist/_assets/scripts/{,*/}*.js",
          "dist/_assets/styles/{,*/}*.css",
          "dist/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}",
          "dist/_assets/styles/fonts/*"
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ["static/index.html"],
      options: {
        dest: "dist",
        flow: {
          html: {
            steps: {
              js: ["concat", "uglify"],
              css: ["concat", "cssmin"]
            },
            post: {}
          }
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: "dist/_assets/styles",
          src: ["*.css", "!*.min.css"],
          dest: "dist/_assets/styles",
          ext: ".min.css"
        }]
      }
    },
    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ["dist/{,*/}*.html"],
      css: ["dist/styles/{,*/}*.css"],
      js: ["dist/scripts/{,*/}*.js"],
      options: {
        assetsDirs: [
          "dist",
          "dist/images",
          "dist/styles",
          "dist/scripts"
        ],
        patterns: {
          js: [[/(img\/[^""""]*\.(png|jpg|jpeg|gif|webp|svg))/g, "Replacing references to images"]]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: "static/_assets/img",
          src: "{,*/}*.{png,jpg,jpeg,gif}",
          dest: ".tmp/img"
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "static/_assets/img",
          src: "{,*/}*.svg",
          dest: "dist/_assets/img"
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: "dist",
          src: ["*.html"],
          dest: "dist"
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: "comicsApp",
          htmlmin: "<%= htmlmin.dist.options %>",
          usemin: "_assets/scripts/scripts.js"
        },
        cwd: "static",
        src: "_assets/partials/**/*.html",
        dest: ".tmp/templateCache.js"
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/concat/scripts",
          src: "*.js",
          dest: ".tmp/concat/scripts"
        }]
      }
    },

    uglify: {
      generated: {
        options: {
          mangle: false
        }
      }
    },
    minjson: {
      data: {
        files: {
          "static/data/books.json":"static/data/books.dev.json",
          "static/data/sa-pedigrees.json":"static/data/sa-pedigrees.dev.json"
        }
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: "static",
          dest: "dist",
          src: [
            "*.{ico,png,txt}",
            "*.html",
            "_assets/partials/{,*/}*.*",
            "_assets/img/{,*/}*.{webp}",
            "_assets/styles/fonts/{,*/}*.*"
          ]
        }, {
          expand: true,
          cwd: ".tmp/img",
          dest: "dist/img",
          src: ["**"]
        }, {
          expand: true,
          cwd: ".tmp/concat",
          dest: "dist",
          src: "**"
        },
        {
          expand: true,
          cwd: "data",
          dest: "dist/data",
          src: "**"
        }
      ] 
      },
      styles: {
        expand: true,
        cwd: "static/_assets/styles",
        dest: "dist/_assets/styles",
        src: "{,*/}*.css"
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      lint: [
        "newer:jshint",
        "newer:jscs"
      ],
      server: [
        "copy:styles"
      ],
      test: [
        "copy:styles"
      ],
      dist: [
        "copy:styles",
        "imagemin",
        "svgmin"
      ]
    },

  });


  grunt.registerTask("test", [
    "clean:server",
    "concurrent:test",
    "postcss:server",
    "connect:test",
    "karma"
  ]);

  grunt.registerTask("build", [
    "concurrent:lint",
    "sass",
    "clean:dist",
    "useminPrepare",
    "concurrent:dist",
    "postcss:dist",
    "ngtemplates",
    "concat",
    "ngAnnotate",
    "copy:dist",
    "uglify",
    "filerev",
    "usemin",
    "htmlmin",
  ]);

  grunt.registerTask("dev", "", function() {
    var tasks = [
			"sass",
      "minjson",
      "concurrent:lint",
      "watch"];
    grunt.task.run(tasks);
  });

  grunt.registerTask("default", [
    "concurrent:lint",
    "test",
    "build"
  ]);
};







/*

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      js: {
        src: ["_assets/static/*"],
        dest: "_assets/js/100k.full.js"
      }
    },
    ngmin: {
      js: {
        src: "_assets/js/100k.full.js",
        dest: "_assets/js/100k.js"
      }
    },
    uglify: {
      js: {
        files: {
          "_assets/js/100k.js": ["_assets/js/100k.js"]
        }
      }
    },

    watch: {
      files: ["data/books.dev.json","data/sa-pedigrees.dev.json", "_assets/static/*"],
      tasks: ["concat", "ngmin", "minjson", "uglify","clean"]
    },
    clean: ["_assets/js/100k.full.js"],
    jshint: {
      files: ["gruntfile.js", "_assets/static/*.js"],
      options: {
        passfail:false,
        maxerr: 100,
        browser: true,
        jquery: true,
        predef: [
          "angular"
        ],
        devel: true,
        bitwise: true,
        boss:false,
        trailing:true,
        sub:true,
        curly:true,
        eqeqeq:true,
        forin:true,
        freeze:true,
        indent:2,
        quotmark:"double",
        unused:true
      }
    }
  });
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-minjson");
  grunt.loadNpmTasks("grunt-ngmin");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["concat:js", "ngmin:js", "uglify:js","clean","minjson:data"]);
};*/
