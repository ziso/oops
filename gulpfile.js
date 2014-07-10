var gulp = require('gulp');
var bower = require('gulp-bower');
var vulcanize = require('gulp-vulcanize');
var express = require('express');
var liveReload = require('gulp-livereload');
var img64 = require('gulp-img64');
var cssBase64 = require('gulp-css-base64');
var argv = require('yargs').argv;

// http server configuration
// =========================
var serverPort = 5000;
var server = express();
function startExpress() {
console.log(yargs.argv.port);
	server.use(express.static('./src'));
	var oopsMockServer = require('./server/server');
	oopsMockServer.listen(server);
}

gulp.task('start', function () {
	startExpress();
});

// live reload support
// ===================
gulp.task('serve', function () {
    server.listen(serverPort);
});

gulp.task('json', function () {
    gulp.src('./server/mocks/*.json')
        .pipe(liveReload());
});

gulp.task('html', function () {
    gulp.src('./src/**')
        .pipe(liveReload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/**'], ['html']);
    gulp.watch(['./server/mocks/*.json'], ['json']);
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
gulp.task('server', ['start', 'serve', 'watch']);
gulp.task('default', ['bower', 'concat', 'server']);