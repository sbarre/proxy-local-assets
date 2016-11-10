var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer');

var config = {

  // CHANGE THIS!
  remoteURL: 'https://www.google.ca/',

  srcDir: './src',
  injectDir: './build',
  localPath: '/local-assets',

  localAssets: {
    css: [
      'css/local.css'
    ],
    js: [
      'js/local.js'
    ]
  }

};

var reload = browserSync.reload;

gulp.task('clean', function() {
  return del.sync(config.injectDir);
});

gulp.task('sass', function() {
  return gulp.src(config.srcDir + '/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.injectDir + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(config.srcDir + '/js/**/*.js')
    .pipe(gulp.dest(config.injectDir + '/js'))
    .pipe(browserSync.stream());
})

gulp.task('browserSync', ['sass', 'js'], function() {
  browserSync.init({
    proxy: {
      target: config.remoteURL
    },
    rewriteRules: [
      {
        // Inject Local CSS at the end of HEAD
        match: /<\/head>/i,
        fn: function(req, res, match) {
          localCssAssets = '';
          for (i=0;i<config.localAssets.css.length;i++) {
            localCssAssets += '<link rel="stylesheet" type="text/css" href="' + config.localPath + '/' + config.localAssets.css[i] + '">';
          }
          return localCssAssets + match;
        }
      },
      {
        // Inject Local JS at the end of BODY
        match: /<\/body>/i,
        fn: function(req, res, match) {
          localJsAssets = '';
          for (i=0;i<config.localAssets.js.length;i++) {
            localJsAssets += '<script src="' + config.localPath + '/' + config.localAssets.js[i] + '"></script>';
          }
          return localJsAssets + match;
        }
      }
    ],
    serveStatic: [{
      route: config.localPath,
      dir: config.injectDir
    }],
    watchTask: true
  });
});

gulp.task('watch', ['browserSync', 'js', 'sass'], function() {
  gulp.watch(config.srcDir + '/scss/**/*.scss', ['sass']);
  gulp.watch(config.srcDir + '/js/**/*.js', ['js']);
});

gulp.task('build', function() {
  runSequence([
    'clean',
    'sass',
    'js'
  ]);
});

gulp.task('default', function() {
  runSequence(['build', 'browserSync', 'watch']);
});
