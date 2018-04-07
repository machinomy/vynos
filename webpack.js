const path = require('path')
const webpack = require('webpack')

const PackageLoadersPlugin = require('webpack-package-loaders-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const NodeExternalsPlugin = require('webpack-node-externals')

require('dotenv').config({ path: '.env' });

const DIST_PATH = path.resolve(__dirname, 'dist')

function webpackConfig (entry, devSupplement) {
  let config = {
    entry: entry,
    devtool: 'source-map',
    externals: [NodeExternalsPlugin({whitelist: [/^(?!(require_optional|bindings|pg)).*$/]})],
    output: {
      filename: devSupplement ? '[name].dev.js' : '[name].js',
      path: DIST_PATH
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // This has effect on the react lib size
        },
        'global.XMLHttpRequest': global.XMLHttpRequest
      }),
      new PackageLoadersPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: process.env.NODE_ENV === 'production' ? ['ts-loader'] : ['babel-loader', 'ts-loader']
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [/node_modules/]
        },
        {
          test: /\.s?css$/i,
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
                  require('postcss-import')(),
                  // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                  require('postcss-nesting')(),
                  //https://github.com/ai/browserslist
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie >= 9']
                  })
                ])
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          exclude: [path.resolve(__dirname, 'vynos'), path.resolve(__dirname, 'harness')],
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
                  require('postcss-import')({
                    //If you are using postcss-import v8.2.0 & postcss-loader v1.0.0 or later, this is unnecessary.
                    //addDependencyTo: webpack // Must be first item in list
                  }),
                  require('postcss-nesting')(),  // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie >= 9'] //https://github.com/ai/browserslist
                  })
                ])
              }
            }
          ]
        },
        {
          test: /\.(eot|woff|woff2|svg|ttf|png)([\?]?.*)$/,
          loader: 'file-loader'
        }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      module: 'empty',
      dns: 'mock'
    }
  }

  if (process.env.NODE_ENV === 'production' && !devSupplement) {
    config.plugins.push(new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        }
      }
    }))
    config.plugins.push(new CopyPlugin([
      path.resolve(__dirname,'vynos', 'frame.html'),
      path.resolve(__dirname,'vynos', 'check.html'),
    ]))
  }

  return config
}

const VYNOS_LIVE = webpackConfig({
  vynos: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${process.env.HARNESS_PORT}`,
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'vynos/vynos.ts'),
  ],
  frame: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${process.env.FRAME_PORT}`,
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'vynos/frame.ts')
  ],
  worker: [
    path.resolve(__dirname, 'vynos/worker.ts')
  ]
});

const VYNOS = webpackConfig({
  vynos: path.resolve(__dirname, 'vynos/vynos.ts'),
  frame: path.resolve(__dirname, 'vynos/frame.ts'),
  worker: path.resolve(__dirname, 'vynos/worker.ts')
});

const VYNOS_DEV = webpackConfig({
  vynos: path.resolve(__dirname, 'vynos/vynos.ts'),
  frame: path.resolve(__dirname, 'vynos/frame.ts'),
  worker: path.resolve(__dirname, 'vynos/worker.ts')
}, true);

const HARNESS = webpackConfig({
  harness: path.resolve(__dirname, 'harness/harness.ts')
});


module.exports.HARNESS = HARNESS;
module.exports.VYNOS_LIVE = VYNOS_LIVE;
module.exports.VYNOS = VYNOS;
module.exports.VYNOS_DEV = VYNOS_DEV;
