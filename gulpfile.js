var gulp = require('gulp');
var bower = require('gulp-bower');
var vulcanize = require('gulp-vulcanize');
var express = require('express');
var liveReload = require('gulp-livereload');
var img64 = require('gulp-img64');
var cssBase64 = require('gulp-css-base64');
var argv = require('yargs').argv;
var logger = require('morgan');
var lr = require('tiny-lr')();

// http server configuration
// =========================
var serverPort = argv.port || 5000;
var server = express();
function startExpress() {
    server.use(require('connect-livereload')());
	server.use('/', express.static('./src'));
	server.use('/bower_components', express.static('./bower_components'));
	server.use('/server', express.static('./server'));
	server.use('/resources', express.static('./resources'));
	server.use('/resources', express.static('./components'));
	server.use('/resources', express.static('./elements'));
	server.use('/resources', express.static('./assets'));
	server.use(logger());
	var oopsMockServer = require('./server/server');
	oopsMockServer.listen(server);
}

// live reload configuration
// =========================
var lrPort = argv.lrport || 35729;
function startLivereload() {
  lr.listen(lrPort);
}

gulp.task('start', function () {
	startExpress();
	startLivereload();
});

// live reload support
// ===================
gulp.task('serve', function () {
    server.listen(serverPort);
	console.log('=============================');
	console.log('Server started on port: ' + serverPort);
	console.log('=============================');
});

gulp.task('json', function () {
    lr.changed({
        body: {
            files: ['./server/mocks/*.json']
        }
    });
});

gulp.task('html', function () {
    lr.changed({
        body: {
            files: ['./src/**']
        }
    });
});

gulp.task('js', function () {
    lr.changed({
        body: {
            files: ['./src/**']
        }
    });
});

gulp.task('serverjs', function () {
    lr.changed({
        body: {
            files: ['./server/*.js']
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['./src/**'], ['html']);
    gulp.watch(['./server/mocks/*.json'], ['json']);
	gulp.watch(['./src/**'], ['js']);
	gulp.watch(['./server/**'], ['serverjs']);
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