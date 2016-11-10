# Proxy Local Assets

A simple BrowserSync-based Gulpfile that proxies a remote server locally and injects one or more specified local CSS files.

This can be used to do effective local CSS development on a remote site that you may not be able to run locally (for any number of reasons).

At the top of the file is a configuration array that can be adjusted to suit your needs.  At minimum you should update the `remoteURL` value:

```
var config = {
  remoteURL: 'https://www.google.ca/',  // CHANGE THIS!
  srcDir: './src',
  injectDir: './build',
  localPath: '/local-assets',
  localAssets: [
    'css/local.css'
  ]
};
```

You can also include additional CSS files in the `config.localAssets` property which would mapp to SASS files in the `src/scss` folder.

The Gulpfile includes a basic SASS-based example build process, but it can be easily extended to use LESS or other tools as required, as long as they ultimately result in a file being output to your `config.injectDir` folder and that file is referenced in the `config.localAssets` property.

You can add additional tasks to the `build` task without changing anything else:

```
gulp.task('build', function() {
  runSequence([
    // Add tasks here
    'sass'
  ]);
});
```

The Gulpfile's default task will run the BrowserSync proxy and watch the SASS folder, so all you need to get started is to run gulp:

```
$ gulp
```

That's it!  This has not been super-duper tested, but it works for me.

### TODOs

  * Include a way to inject JS files at the bottom of the document body.  May need to investigate BrowserSync's middleware options for this?