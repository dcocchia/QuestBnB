var gulp = require('gulp');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var path = require('path');
var minifyCSS = require('gulp-minify-css')

gulp.task('less', function () {
  return gulp.src('./public/app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/app/css'));
});

// gulp.task('watch', function() {
//     gulp.watch('./public/app/less/**/*.less', ['less']);
// });

gulp.task('develop', function() {
	nodemon({ 
		script: 'index.js', 
		ext: 'html js jsx less',
		ignore: [
			".git",
    		"node_modules/**/node_modules"
		]
	})
    .on('change', 'less')
});

gulp.task('default', ['less']);