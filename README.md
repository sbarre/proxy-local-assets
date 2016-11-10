# Proxy Local Assets

A simple BrowserSync-based Gulpfile that proxies a remote server locally and injects one or more specified local CSS and JS files.

This can be used to do effective local development on a remote site that you may not be able to run locally (for any number of reasons).

At the top of the file is a configuration array that can be adjusted to suit your needs.  At minimum you should update the `remoteURL` value:

```javascript
var config = {
  remoteURL: 'https://www.google.ca/',  // CHANGE THIS!
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
```

You can also include additional CSS & JS files in the `config.localAssets` property which would map to SASS files in the `src/scss` folder and JS files in the `src/js` folder.

The Gulpfile includes a basic SASS-based example build process, but it can be easily extended to use LESS or other tools as required, as long as they ultimately result in a file being output to your `config.injectDir` folder and that file is referenced in the `config.localAssets.css` property.

For this example, Javascript files are copied directly from `src/js` to your `config.injectDir` folder without any modifications.

You can add additional tasks to the `build` task without changing anything else:

```javascript
gulp.task('build', function() {
  runSequence([
    'sass',
    'js'
    // Add tasks here
  ]);
});
```

### Getting Started

*It is assumed that you have Node, NPM and Gulp installed at the system level.*

First, install the local dependencies:

```
$ npm install
```

The Gulpfile's default task will run the BrowserSync proxy and watch the SASS and JS folders, so all you need to get started is to run gulp:

```
$ gulp
```

That's it!  This has not been super-duper tested, but it works for me.

