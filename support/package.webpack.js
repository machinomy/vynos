'use strict'

const path = require('path')
const webpack = require('./webpack')
const CopyPlugin = require('copy-webpack-plugin')

const DIST_PATH = 'dist'

function resolve(filePath) {
  return path.resolve(__dirname, '..', ...filePath.split('/'))
}

let config = webpack.bundle({ index: webpack.resolve('vynos/index.ts') }, config => {
  config.output.library = 'vynos'
  config.output.libraryTarget = 'umd'
  config.plugins.push(new CopyPlugin([{
    context: 'vynos/',
    from: 'index.d.ts',
    to: resolve(DIST_PATH) + '/'
  }]))
  return config
})


module.exports = config
