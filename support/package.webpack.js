'use strict'

const webpack = require('./webpack')

let config = webpack.bundle({ index: webpack.resolve('vynos/index.ts') }, config => {
  config.output.library = 'vynos'
  config.output.libraryTarget = 'umd'
  return config
})


module.exports = config
