var gulp = require('gulp');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var path = require('path');
var wrap = require('gulp-wrap');
var minifyCSS = require('gulp-minify-css');
var react = require('gulp-react');
var handlebars = require('gulp-handlebars');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');

gulp.task('less', function () {
  return gulp.src('./public/app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/app/css'));
});

gulp.task('jsx', function() {
  return gulp.src('./views/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('./public/views'));
});

gulp.task('browserify', ['jsx'], function() {
  return browserify('./public/app/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('test', function (cb) {
  gulp.src(['./public/app/backbone_collections/*.js', './public/app/backbone_models/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['./tests/*.js'], {read: false})
        .pipe(mocha({ globals: ["google"] }))
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('lint', function() {
  return gulp.src(['./public/app/backbone_collections/*.js', './public/app/backbone_models/*.js', './public/app/app.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('develop', function() {
	nodemon({ 
		script: 'index.js', 
		ext: 'html js jsx less',
		ignore: [
			".git",
    	"node_modules/**/node_modules",
      "./public/views/*",
      "./public/app/css/*",
      "./public/bundle.js"
		]
	})
    .on('change', ['less', 'jsx', 'browserify'])
});

gulp.task('default', ['less', 'jsx', 'browserify']);