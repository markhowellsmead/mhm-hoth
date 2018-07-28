let gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint');

// Styles
gulp.task('styles', function() {
	return gulp.src(['assets/src/styles/**/*.scss', '!assets/src/styles/**/_*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({
			style: 'compressed'
		}))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer('last 3 versions', 'safari 9', 'ie 11', 'ios 9', 'android 4.3'))
		.pipe(rename('style.css'))
		.pipe(cleancss())
		.pipe(gulp.dest(''));
});

// Scripts
gulp.task('scripts', ['hint'], function() {
	return gulp.src('assets/src/scripts/**/*.js')
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('assets/dist/scripts'));
});

// Scripts
gulp.task('hint', function() {
	return gulp.src('assets/src/scripts/main.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Images
gulp.task('images', function() {
	return gulp.src(['assets/src/images/**/*.jpeg',
			'assets/src/images/**/*.jpg',
			'assets/src/images/**/*.png',
			'assets/src/images/**/*.svg'
		])
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('assets/dist/images'));
});

// Libraries
gulp.task('libraries', function() {
	gulp.src(['assets/src/vendor/vendor.js'])
		.pipe(concat('vendor.js'))
		//.pipe(rename({ suffix: '.min' }))
		//.pipe(uglify())
		.pipe(gulp.dest('assets/dist/vendor'))
});

// Libraries - copy CSS and JS files from assets/src/vendor/ to assets/dist/vendor/
// Only CSS and JS files will be copied and the file structure will be maintained
// e.g. put JS and CSS for fancybox in assets/src/vendor/fancybox/ and they will be copied to assets/dist/vendor/fancybox/
gulp.task('libraries-copy', ['clean-vendor'], function() {
	gulp.src(['assets/src/vendor/**/*.css', 'assets/src/vendor/**/*.js'])
		.pipe(gulp.dest('assets/dist/vendor'));
});

// Fonts
gulp.task('fonts', function() {
	return gulp.src(['assets/src/fonts/*'])
		.pipe(gulp.dest('assets/dist/fonts'));
});

// Clean
gulp.task('clean', function() {
	return gulp.src(['assets/dist/'], { read: false })
		.pipe(clean());
});

// Delete dist vendor folder
gulp.task('clean-vendor', function() {
	return gulp.src(['assets/dist/vendor'], { read: false })
		.pipe(clean());
});

// Watch
gulp.task('watch', function() {
	// Watch .scss files
	gulp.watch('assets/src/styles/**/*.scss', ['styles']);

	// Watch .js files
	gulp.watch('assets/src/scripts/**/*.js', ['scripts']);

	// Watch images
	gulp.watch('assets/src/images/**/*', ['images']);

});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images', 'fonts', 'libraries-copy');
});

gulp.task('production', ['default'], function() {
	return gulp.src(['assets/dist/**/*.map'], { read: false })
		.pipe(clean());
});
