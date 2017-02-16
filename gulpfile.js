var gulp = require("gulp"),
	sass = require("gulp-sass"),
	browserSync = require("browser-sync").create(),
	runSequence = require("run-sequence"),
	del = require("del"),
	glob = require("glob"),
	autoprefixer = require("gulp-autoprefixer");

var config = {

	// CHANGE THIS!
	remoteURL: "https://seb.rallyhavas.com/",

	srcDir: "./src",
	injectDir: "./build",
	localPath: "/local-assets",

	localAssets: {
		css: [
			"css/**/*.css"
		],
		js: [
			"js/**/*.js"
		]
	}

};

gulp.task("clean", function() {
	return del.sync(config.injectDir);
});

gulp.task("sass", function() {
	return gulp.src(config.srcDir + "/scss/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(config.injectDir + "/css"))
		.pipe(browserSync.stream());
});

gulp.task("js", function() {
	return gulp.src(config.srcDir + "/js/**/*.js")
		.pipe(gulp.dest(config.injectDir + "/js"))
		.pipe(browserSync.stream());
});

gulp.task("browserSync", ["sass", "js"], function() {
	browserSync.init({
		proxy: {
			target: config.remoteURL
		},
		rewriteRules: [{
			// Inject Local CSS at the end of HEAD
			match: /<\/head>/i,
			fn: function(req, res, match) {
				var localCssAssets = "";
				for (var i = 0; i < config.localAssets.css.length; i++) {

					var files = glob.sync(config.localAssets.css[i], {
						cwd: config.injectDir
					});

					for (var file in files) {
						localCssAssets += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + config.localPath + "/" + files[file] + "\">";
					}
				}

				return localCssAssets + match;
			}
		}, {
			// Inject Local JS at the end of BODY
			match: /<\/body>/i,
			fn: function(req, res, match) {
				var localJsAssets = "";
				for (var i = 0; i < config.localAssets.js.length; i++) {

					var files = glob.sync(config.localAssets.js[i], {
						cwd: config.injectDir
					});

					for (var file in files) {
						localJsAssets += "<script src=\"" + config.localPath + "/" + files[file] + "\"></script>";
					}
				}

				return localJsAssets + match;
			}
		}],
		serveStatic: [{
			route: config.localPath,
			dir: config.injectDir
		}],
		watchTask: true
	});
});

gulp.task("watch", ["browserSync", "js", "sass"], function() {
	gulp.watch(config.srcDir + "/scss/**/*.scss", ["sass"]);
	gulp.watch(config.srcDir + "/js/**/*.js", ["js"]);
});

gulp.task("build", function() {
	runSequence([
		"clean",
		"sass",
		"js"
	]);
});

gulp.task("default", function() {
	runSequence(["build", "browserSync", "watch"]);
});
