'use strict';

const   path                        = require("path"),
        gulp                        = require("gulp"),
        gutil                       = require("gulp-util"),
        webpack                     = require("webpack"),
        WebpackDevServer            = require('webpack-dev-server'),
        YNOS_WEBPACK_CONFIG         = require('./ynos.webpack.config').YNOS_WEBPACK_CONFIG,
        YNOS_LIVE_WEBPACK_CONFIG    = require('./ynos.webpack.config').YNOS_LIVE_WEBPACK_CONFIG,
        HARNESS_WEBPACK_CONFIG      = require('./harness.webpack.config');

require('dotenv').config({ path: 'app.config.env' });


// Build Ynos, Frame
gulp.task("build", callback => {
  webpack(YNOS_WEBPACK_CONFIG).run(function(err, stats) {
    if(err) throw new gutil.PluginError('build', err);
    gutil.log('build', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("build:harness", ["build"], callback => {
  webpack(HARNESS_WEBPACK_CONFIG).run(function(err, stats) {
    if(err) throw new gutil.PluginError('build', err);
    gutil.log('build:harness', stats.toString({
      colors: true
    }));
    callback();
  });
});

// Serve Ynos, Frame at http://localhost:9999/webpack-dev-server
gulp.task("serve", () => {
  new WebpackDevServer(webpack(YNOS_LIVE_WEBPACK_CONFIG), {
    contentBase: 'ynos/',
    hot: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }).listen(process.env.FRAME_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('build:serve', err);
    gutil.log('webpack-dev-server', `http://localhost:${process.env.FRAME_PORT}/webpack-dev-server/index.html`);
  });
});

gulp.task("serve:built", () => {
  new WebpackDevServer(webpack(YNOS_WEBPACK_CONFIG), {
    contentBase: 'ynos/',
    hot: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }).listen(process.env.FRAME_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('serve:built', err);
    gutil.log('webpack-dev-server', `http://localhost:${process.env.FRAME_PORT}/webpack-dev-server/index.html`);
  });
});

gulp.task("serve:harness", ["serve"], () => {
  new WebpackDevServer(webpack(HARNESS_WEBPACK_CONFIG), {
    stats: {
      colors: true
    },
    contentBase: 'harness/'
  }).listen(process.env.HARNESS_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('harness:serve', err);
    gutil.log('webpack-dev-server', `http://localhost:${process.env.HARNESS_PORT}/webpack-dev-server/index.html`);
  });
});

gulp.task("harness:serve", ["serve:harness"]);
