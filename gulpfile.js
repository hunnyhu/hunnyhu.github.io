var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('server', function() {
	connect.server({
		root: '.'
	});
});

gulp.task('serverlive', function() {
	connect.server({
		root: '.',
		livereload: true
	});
});
gulp.task('copylive', function() {
	return gulp.src('index.html')
	.pipe(gulp.dest('dest'))
	.pipe(connect.reload());
});
gulp.task('watchlive', function() {
	gulp.watch('index.html', ['copylive']);
});
gulp.task('defaultlive', ['serverlive', 'watchlive']);

gulp.task('concatjs', function() {
	gulp.src(['src/**/*.js'])
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest('dest'))
	.pipe(uglify())
	.pipe(rename('vendor.min.js'))
	.pipe(gulp.dest('dest'));
});

gulp.task('clean', function() {
	del(['dest/*']);
});