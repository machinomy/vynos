"use strict";

const path = require("path");
const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const PackageLoadersPlugin = require('webpack-package-loaders-plugin')

const DIST_PATH = path.resolve(__dirname, "dist");

const YNOS_PORT=9090;
const HARNESS_PORT = 8080;

const YNOS_WEBPACK_CONFIG = webpackConfig({
  ynos: path.resolve(__dirname, "ynos/ynos.ts"),
  frame: path.resolve(__dirname, "ynos/frame.ts")
});

const HARNESS_WEBPACK_CONFIG = webpackConfig({
  harness: path.resolve(__dirname, "harness/harness.ts"),
});

function webpackConfig (entry) {
  let config = {
    entry: entry,
    devtool: "source-map",
    output: {
      filename: "[name].bundle.js",
      path: DIST_PATH
    },
    plugins: [
      new webpack.DefinePlugin({
        "window.FRAME_URL": JSON.stringify(`http://localhost:${YNOS_PORT}/frame.html`)
      }),
      new PackageLoadersPlugin()
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },
  };

  if (process.env.NODE_ENV === 'production') {
    config.plugins = config.plugins.concat(
      new webpack.DefinePlugin({
        "process.env": {
          // This has effect on the react lib size
          "NODE_ENV": JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin()
    );
    config.output.path = DIST_PATH;
  }

  return config
}

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

// Serve Ynos, Frame at http://localhost:8080/webpack-dev-server
gulp.task("build:serve", () => {
  new WebpackDevServer(webpack(YNOS_WEBPACK_CONFIG), {
    stats: {
      colors: true
    },
    contentBase: 'ynos/'
  }).listen(YNOS_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('build:serve', err);
    gutil.log('webpack-dev-server', `http://localhost:${YNOS_PORT}/webpack-dev-server/index.html`);
  });
});

gulp.task("harness:serve", ["build:serve"], () => {
  new WebpackDevServer(webpack(HARNESS_WEBPACK_CONFIG), {
    stats: {
      colors: true
    },
    contentBase: 'harness/'
  }).listen(HARNESS_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('harness:serve', err);
    gutil.log('webpack-dev-server', `http://localhost:${HARNESS_PORT}/webpack-dev-server/index.html`);
  });
});
