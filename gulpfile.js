"use strict";

const path = require('path');
const gulp = require("gulp");
const webpack = require("webpack");
const ts = require("gulp-typescript");
const gulpUtil = require("gulp-util");
const serve = require('gulp-serve');

const BUILD_PATH = path.resolve(__dirname, 'build');
const DIST_PATH = path.resolve(__dirname, 'dist');
const HARNESS_PORT = 8080;

function webpackConfig () {
  return {
    entry: {
      ynos: './build/ynos.js',
    },
    devtool: 'source-map',
    output: {
      filename: '[name].bundle.js',
      path: DIST_PATH
    },
    plugins: [],
    devServer: {
      contentBase: BUILD_PATH,
      hot: true,
      compress: false,
      port: HARNESS_PORT
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ["react"],
            }
          }
        },
      ]
    }
  };
}

function prodWebpackConfig () {
  let config = Object.create(webpackConfig());
  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
  return config;
}

gulp.task("build", () => {
  return gulp.src("src/**/*.ts")
    .pipe(ts({
      noImplicitAny: true,
      declaration: true
    }))
    .pipe(gulp.dest("build"))
});

gulp.task("dist", ["build"], (callback) => {
  // run webpack
  webpack(prodWebpackConfig(), (err, stats) => {
    if(err) throw new gulpUtil.PluginError("webpack:build", err);
    gulpUtil.log('[dist]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("harness:serve:prod", ["dist"], serve({
  root: [ "harness", "dist" ],
  port: 8080
}));

gulp.task("harness:serve:dev", () => {

});

gulp.task("harness", ["harness:serve:dev"]);
gulp.task("harness:prod", ["harness:serve:prod"]);
