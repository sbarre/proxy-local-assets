# Proxy Local Assets

**Have you ever been asked to make CSS or JS changes to a live website that you have no back-end access to?  If so, you know how much of a pain in the ass it can be.**

This is a simple BrowserSync-based Gulpfile that proxies a remote site locally and injects one or more specified local CSS and JS files, watches for changes to those local files and automatically refreshes your browser as you code.

This can be used to improve your local development workflow when working on a remote site that you may not be able to run locally (for any number of reasons), and avoids the painfully inefficient *"Make local changes, upload your changes, refresh remote server, verify, repeat"* loop.

Do all your CSS & JS work locally, see it applied immediately to the remote server (within reason), and upload or deliver all your tested changes at once.

### How it works

At the top of the Gulpfile is a configuration array that can be adjusted to suit your needs.  At minimum you should update the `remoteURL` value:

```javascript
var config = {
  remoteURL: 'https://www.google.ca/',  // CHANGE THIS!
  srcDir: './src',
  injectDir: './build',
  localPath: '/local-assets',
  localAssets: {
    css: [
      'css/**/*.css'
    ],
    js: [
      'js/**/*.js'
    ]
  }
};
```

All CSS & JS files in the `config.localAssets` properties, which would map to SASS files in the `src/scss` folder and JS files in the `src/js` folder, will be injected into the page.

The Gulpfile includes a basic SASS-based example build process, but it can be easily extended to use LESS or other tools as required, as long as they ultimately result in a file being output to your `config.injectDir` folder.

For this example, Javascript files are copied directly from `src/js` to your `config.injectDir` folder without any modifications.

You can add additional tasks to the aggregating `build` task without changing anything else (such as font copying, minification, compression, etc):

```javascript
gulp.task('build', function() {
  runSequence([
    'sass',
    'images',
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

### Known limitations

Since this script proxyies an existing site, it cannot currently modify the page source, only inject things into it (currently in very specific locations).
So you cannot, for example, add new markup to the DOM or insert/change existing images on the page.

However, if you include images in your local SCSS, as long as the image url() starts with `config.localPath + '/img'` (or whatever folder you create in the `src` folder),
they will be injected as well.  See the example in the `local.scss` file for a local image injection.

### Future features

* Dynamically replace in-page assets (images, videos, etc) with local assets, if they exist
* Override specific DOM elements with local partials
