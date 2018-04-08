'use strict'

const path = require('path')
const webpack = require('webpack')

const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const NodeExternalsPlugin = require('webpack-node-externals')

require('dotenv').config({ path: '.env' })
const NODE_ENV = process.env.NODE_ENV || 'development'
const BACKGROUND_PORT = process.env.BACKGROUND_PORT || 9001
const HARNESS_PORT = process.env.HARNESS_PORT || 9000

const DIST_PATH = 'dist'
const EXTERNALS_WHITELIST = /^(?!(require_optional|bindings|pg)).*$/

function outputFilename() {
  return '[name].js'
}

function resolve(filePath) {
  return path.resolve(__dirname, '..', ...filePath.split('/'))
}

function embedAddress () {
  let version = require('../package').version
  switch (NODE_ENV) {
    case 'production':
      return `https://vynos.tech/v${version}/vynos.js`
    default:
      return `http://localhost:${BACKGROUND_PORT}/vynos.js`
  }
}

function definitions() {
  return {
    'process.env': {
      'NODE_ENV': JSON.stringify(NODE_ENV),
      'EMBED_ADDRESS': JSON.stringify(embedAddress())
    },
    'global.XMLHttpRequest': global.XMLHttpRequest
  }
}

function bundle (entry) {
  let config = {
    entry: entry,
    output: {
      filename: outputFilename(),
      path: resolve(DIST_PATH)
    },
    mode: 'development',
    devtool: 'source-map',
    externals: [NodeExternalsPlugin({whitelist: [EXTERNALS_WHITELIST]})],
    plugins: [
      new webpack.DefinePlugin(definitions()),
      new HtmlPlugin({
        template: resolve('vynos/frame/frame.html'),
        filename: 'frame.html',
        excludeChunks: ['worker', 'vynos', 'harness']
      })
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre',
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
                  require('postcss-nesting')(),
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
          exclude: [resolve('vynos'), resolve('harness')],
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

  switch (NODE_ENV) {
    case 'production':
      config.mode = 'production'
      config.plugins.push(new CopyPlugin([
        resolve('vynos/check.html')
      ]))
      break
    default:
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
      config.plugins.push(new webpack.NamedModulesPlugin())
  }

  return config
}

function workerBundle (entry) {
  let config = bundle(entry)
  config.output.globalObject = 'this'
  return config
}

module.exports.bundle = bundle
module.exports.resolve = resolve
module.exports.BACKGROUND_PORT = BACKGROUND_PORT
module.exports.HARNESS_PORT = HARNESS_PORT


module.exports.HARNESS = bundle({
  harness: resolve('harness/harness.ts')
})

module.exports.FRAME = bundle({
  frame: resolve('vynos/frame.ts'),
})

module.exports.WORKER = workerBundle({
  worker: resolve('vynos/worker.ts')
})

module.exports.EMBED = bundle({
  vynos: resolve('vynos/vynos.ts')
})
