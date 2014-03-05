module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'js/*'
                ],
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
    }
});
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat:js', 'uglify:js','minjson:data']);
};