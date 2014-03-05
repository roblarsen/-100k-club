module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: ['js/*'],
                dest: 'js/100k.full.js'
            }
        },
        ngmin: {
            js: {
                src: 'js/100k.full.js',
                dest: 'js/100k.js'
            }
            
        },
        uglify: {
            js: {
                files: {
                    'js/100k.js': ['js/100k.js']
                }
            }
        },
        minjson: {
            data: {
                files: { 
                'data/books.json':'data/books.dev.json',
                'data/sa-pedigrees.json':'data/sa-pedigrees.dev.json'    
                }
            }
        },
        watch: {
          files: ['data/*', 'js/*'],
          tasks: ['concat', 'ngmin', 'minjson', 'uglify']
       },
       shell: {
            server: {
                command: 'node ./web-server.js &'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat:js', 'ngmin:js', 'uglify:js','minjson:data']);
};