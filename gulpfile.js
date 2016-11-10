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

  localAssets: [
    'css/local.css'
  ]

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

gulp.task('browserSync', ['sass'], function() {
  browserSync.init({
    proxy: {
      target: config.remoteURL
    },
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function(snippet, match) {
          localAssets = '';
          for (i=0;i<config.localAssets.length;i++) {
            localAssets += '<link rel="stylesheet" type="text/css" href="' + config.localPath + '/' + config.localAssets[i] + '">';
          }
          return localAssets + snippet + match;
        }
      }
    },
    serveStatic: [{
      route: config.localPath + '/css',
      dir: config.injectDir + '/css'
    }],
    watchTask: true
  });
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch(config.srcDir + '/scss/**/*.scss', ['sass']);
});

gulp.task('build', function() {
  runSequence([
    'sass'
  ]);
});

gulp.task('default', function() {
  runSequence(['build', 'browserSync', 'watch']);
});
