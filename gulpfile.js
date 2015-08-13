'use strict';

var gulp = require('gulp'),
    path = require('path'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    prefix = require('gulp-autoprefixer'),
    inlineCss = require('gulp-inline-css'),
    http = require('http'),
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    rimraf = require('rimraf');

var src = 'src/';
var dist = path.resolve('dist/');

gulp.task('server', function () {
    var serve = serveStatic(dist);
    var port = 4000;
    http.createServer(function (req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    }).listen(port);
    console.log('\nlocal server runing at http://localhost:' + port + '/\n');
});

gulp.task('html', function () {
    gulp.src(src + 'index.html')
        .pipe(gulp.dest(dist))
        .pipe(livereload());
});

gulp.task('img', function () {
    gulp.src([src + 'img/*.png', src + 'img/*.gif', src + 'img/*.jpg'])
        .pipe(gulp.dest(dist + '/img'));
});

gulp.task('css', function () {
    gulp.src(src + 'sass/*.scss')
        .pipe(sass({
            outputStyle: ['expanded'],
            errLogToConsole: true
        }))
        .pipe(prefix())
        .pipe(gulp.dest(src))
        .pipe(gulp.dest(dist))
        .pipe(livereload());
});

gulp.task('inliner', function () {
    return gulp.src(src + 'index.html')
        .pipe(inlineCss())
        .pipe(gulp.dest(dist));
});

gulp.task('deleteCss', function (cb) {
    rimraf('./dist/styles.css', cb);
});

gulp.task('watch', function () {
    livereload.listen(35729, function (err) {
        if (err) {
            return console.log(err);
        }
        gulp.watch(src + 'index.html', ['html']);
        gulp.watch(src + 'sass/**/*.scss', ['css']);
    });

});

gulp.task('build', function () {
    runSequence('html', 'css', 'img');
});

gulp.task('prod', function () {
    runSequence(['inliner', 'deleteCss']);
});

gulp.task('default', function (callback) {
    runSequence('build', ['server', 'watch']);
});
