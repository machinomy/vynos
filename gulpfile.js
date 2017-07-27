"use strict";

const path = require("path");
const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const PackageLoadersPlugin = require('webpack-package-loaders-plugin')
const packageJson = require('./package.json')

const DIST_PATH = path.resolve(__dirname, "dist");

const FRAME_PORT = 9090;
const HARNESS_PORT = 9999;

const CONTRACT_ADDRESS_PLACEHOLDER = '[DEFAULT_CONTRACT_ADDRESS]'
let CONTRACT_ADDRESS = null
if (packageJson.custom.contract_address !== CONTRACT_ADDRESS_PLACEHOLDER) {
  CONTRACT_ADDRESS = JSON.stringify(packageJson.custom.contract_address)
}

const RPC_URL_PLACEHOLDER = '[DEFAULT_RPC_URL]'
let RPC_URL = JSON.stringify('https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH')
if (packageJson.custom.rpc_url !== RPC_URL_PLACEHOLDER) {
  RPC_URL = JSON.stringify(packageJson.custom.rpc_url)
}

const YNOS_WEBPACK_CONFIG = webpackConfig({
  ynos: [
    `webpack-dev-server/client?http://localhost:${HARNESS_PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.resolve(__dirname, "ynos/ynos.ts"),
  ],
  frame: [
    `webpack-dev-server/client?http://localhost:${FRAME_PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.resolve(__dirname, "ynos/frame.ts")
  ],
  worker: [
    path.resolve(__dirname, "ynos/worker.ts")
  ]
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        "window.FRAME_URL": JSON.stringify(`http://localhost:${FRAME_PORT}/frame.html`),
        "window.RPC_URL": RPC_URL,
        "self.CONTRACT_ADDRESS": CONTRACT_ADDRESS,
      }),
      new PackageLoadersPlugin()
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            "react-hot-loader/webpack",
            "ts-loader"
          ]
        },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        {
          test: /\.css$/i,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: true,
                camelCase: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
                minimize: false
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([
                  require("postcss-import")(),
                  // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                  require("postcss-nesting")(),
                  //https://github.com/ai/browserslist
                  require("autoprefixer")({
                    browsers: ['last 2 versions', 'ie >= 9']
                  })
                ])
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          exclude: [path.resolve(__dirname, "ynos"), path.resolve(__dirname, "harness")],
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                minimize: true
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([
                  require("postcss-import")({
                    //If you are using postcss-import v8.2.0 & postcss-loader v1.0.0 or later, this is unnecessary.
                    //addDependencyTo: webpack // Must be first item in list
                  }),
                  require("postcss-nesting")(),  // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                  require("autoprefixer")({
                    browsers: ['last 2 versions', 'ie >= 9'] //https://github.com/ai/browserslist
                  })
                ])
              }
            }
          ]
        },
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
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
gulp.task("build:serve", () => {
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
  }).listen(FRAME_PORT, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('build:serve', err);
    gutil.log('webpack-dev-server', `http://localhost:${FRAME_PORT}/webpack-dev-server/index.html`);
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
