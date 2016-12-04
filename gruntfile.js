module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      js: {
        src: ["_assets/app/*"],
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
    minjson: {
      data: {
        files: {
          "data/books.json":"data/books.dev.json",
          "data/sa-pedigrees.json":"data/sa-pedigrees.dev.json"
        }
      }
    },
    watch: {
      files: ["data/books.dev.json","data/sa-pedigrees.dev.json", "_assets/app/*"],
      tasks: ["concat", "ngmin", "minjson", "uglify","clean"]
    },
    clean: ["_assets/js/100k.full.js"],
    jshint: {
      files: ["gruntfile.js", "_assets/app/*.js"],
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
};