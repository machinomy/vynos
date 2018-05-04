'use strict'

const webpack = require('./webpack')

let config = webpack.bundle({
  index: webpack.resolve('vynos/index.ts')
})
config.output.library = 'vynos'
config.output.libraryTarget = 'umd'

module.exports = config
