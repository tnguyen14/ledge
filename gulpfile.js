var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var xtend = require('xtend');

gulp.task('scss', function () {
	gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function () {
	gulp.src('app/**/*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(require('jshint-stylish')));
});

var watching = false;
gulp.task('enable-watch-mode', function () { watching = true });

gulp.task('scripts', ['jshint'], function () {
	var opts = {
		entries: './app/scripts/main.js',
		debug: (gutil.env.type === 'development')
	}
	if (watching) {
		opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (watching) {
		bundler = watchify(bundler);
	}
	// optionally transform
	// bundler.transform('transformer');

	bundler.on('update', function (ids) {
		gutil.log('File(s) changed: ' + gutil.colors.cyan(ids));
		gutil.log('Rebunlding...');
	});

	function rebundle() {
		return bundler
			.bundle()
			.on('error', function (e) {
				gutil.log(gutil.colors.red('Browserify ' + e));
			})
			.pipe(source('main.js'))
			.pipe(gulp.dest('dist/scripts'));
	}
	return rebundle();
});

gulp.task('build', ['html', 'scss', 'scripts']);

gulp.task('watch', ['enable-watch-mode', 'scripts'], function () {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/**/*.html', ['html']);
})