var gulp = require('gulp');
var bower = require('gulp-bower');
var vulcanize = require('gulp-vulcanize');
var express = require('express');
var liveReload = require('gulp-livereload');
var img64 = require('gulp-img64');
var cssBase64 = require('gulp-css-base64');

var server = express();
var mockEndpoints = require('./mock-server/mock-endpoints');
var serverPort = 5000;

// http server configuration
// =========================
server.use(express.static('./'));
mockEndpoints.listen(server);

// live reload support
// ===================
gulp.task('serve', function () {
    server.listen(serverPort);
});

gulp.task('json', function () {
    gulp.src('./mock-server/*.json')
        .pipe(liveReload());
});

gulp.task('html', function () {
    gulp.src('./src/**')
        .pipe(liveReload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/**'], ['html']);
    gulp.watch(['./mock-server/*.json'], ['json']);
});

// inline everything
// =================
gulp.task('concat', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({dest: 'dist', inline: true}))
        .pipe(img64())
        .pipe(cssBase64())
        .pipe(gulp.dest('dist'));
});

// public tasks
// ============
gulp.task('bower', function () { return bower().pipe(gulp.dest('lib/')); });
gulp.task('server', ['serve', 'watch']);
gulp.task('default', ['concat']);