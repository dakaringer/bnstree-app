var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var es = require('event-stream');
 
gulp.task('img', function () {
    return gulp.src('./gulp/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant({floyd: 0, quality: '90-100', speed: 1})]
        }))
        .pipe(gulp.dest('./public/img/'));
});

gulp.task('sass', function () {    
    gulp.src('./gulp/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 5%', 'last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('react', ['react1', 'react2', 'react3', 'react4']);

gulp.task('react1', function () {
    var compile = gulp.src('./gulp/js/react/trainer3.jsx')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('./gulp/js/react/compiled'));
    
    es.merge(compile, gulp.src(['./gulp/js/react/react.min.js', './gulp/js/react/react-dom.min.js', './gulp/js/react/movieClip.js']))
        .pipe(concat({path: 'trainer3.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('react2', function () {
    var compile = gulp.src('./gulp/js/react/mixer.jsx')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('./gulp/js/react/compiled'));
    
    es.merge(compile, gulp.src(['./gulp/js/react/react.min.js', './gulp/js/react/react-dom.min.js']))
        .pipe(concat({path: 'mixer.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('react3', function () {
    var compile = gulp.src('./gulp/js/react/evolver.jsx')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('./gulp/js/react/compiled'));
    
    es.merge(compile, gulp.src(['./gulp/js/react/react.min.js', './gulp/js/react/react-dom.min.js']))
        .pipe(concat({path: 'evolver.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('react4', function () {
    var compile = gulp.src('./gulp/js/react/timer.jsx')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('./gulp/js/react/compiled'));
    
    es.merge(compile, gulp.src(['./gulp/js/react/react.min.js', './gulp/js/react/react-dom.min.js']))
        .pipe(concat({path: 'timer.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('extrajs', function () {
    gulp.src('./gulp/js/*.js')
        .pipe(concat({path: 'vendor.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('./gulp/sass/**/*.scss',['sass']);
    gulp.watch('./gulp/js/react/trainer3.jsx',['react1']);
    gulp.watch('./gulp/js/react/mixer.jsx',['react2']);
    gulp.watch('./gulp/js/react/evolver.jsx',['react3']);
    gulp.watch('./gulp/js/react/timer.jsx',['react4']);
    gulp.watch('./gulp/js/*.js',['extrajs']);
});

gulp.task('default', ['watch']);