var gulp           = require('gulp'),
    jade           = require('gulp-jade'),
    connect        = require('gulp-connect'),
    ts             = require('gulp-typescript'),
    concat         = require('gulp-concat'),
    LIB_FILES      = ['bower_components/phaser/build/phaser.min.js'],
    SCRIPT_FILES   = ['src/ts/**/*.ts'],
    TEMPLATE_FILES = ['src/templates/**/*.jade'],
    ASSET_FILES    = ['src/assets/**/*'];

// gulp.task('lint', function() {
//     gulp.src(SCRIPT_FILES)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

gulp.task('libs', function() {
    gulp.src(LIB_FILES)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
    var tsResult = gulp.src(SCRIPT_FILES)
        .pipe(ts({
            noImplicitAny: true,
            out: 'main.js'
        }));
    return tsResult.js
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());
});

gulp.task('templates', function () {
    gulp.src(TEMPLATE_FILES)
        .pipe(jade())
        .pipe(gulp.dest('public'))
        .pipe(connect.reload());
});

gulp.task('assets', function () {
    gulp.src(ASSET_FILES)
        .pipe(gulp.dest('public/assets'))
        .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
    gulp.watch(SCRIPT_FILES, ['scripts']);
    gulp.watch(TEMPLATE_FILES, ['templates']);
    gulp.watch(ASSET_FILES, ['assets']);
});

gulp.task('server', function () {
    connect.server({
        root: 'public',
        livereload: true
    });
});

gulp.task('build', ['templates', 'scripts', 'libs', 'assets']);

gulp.task('dev', ['watch', 'server']);

gulp.task('default', ['dev']);
