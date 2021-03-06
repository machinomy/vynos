'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

require('dotenv').config({ path: '.env' })
const BACKGROUND_PORT = require('./support/webpack').BACKGROUND_PORT
const HARNESS_PORT = require('./support/webpack').HARNESS_PORT

const INDEX = require('./support/package.webpack')
const EMBED = require('./support/webpack').EMBED
const FRAME = require('./support/webpack').FRAME
const WORKER = require('./support/webpack').WORKER
const HARNESS = require('./support/webpack').HARNESS

const COMPONENTS = [EMBED, FRAME, WORKER, INDEX]

gulp.task('build', callback => {
  webpack(COMPONENTS).run((err, stats) => {
    if (err) throw new gutil.PluginError('build', err)

    gutil.log('build', stats.toString({
      colors: true
    }))

    callback()
  })
})

gulp.task('build:harness', ['build'], callback => {
  webpack(HARNESS).run((err, stats) => {
    if (err) throw new gutil.PluginError('build:harness', err)

    gutil.log('build:harness', stats.toString({
      colors: true
    }))

    callback()
  })
})

// Serve the Wallet at http://localhost:9999/webpack-dev-server
gulp.task('serve', () => {
  const config = {
    contentBase: 'vynos/',
    hot: true,
    stats: 'minimal',
    lazy: false,
    compress: true
  }

  new WebpackDevServer(webpack(COMPONENTS), config).listen(BACKGROUND_PORT, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('serve', err)
  })
})

gulp.task('serve:harness', ['serve'], () => {
  const config = {
    contentBase: 'harness/',
    stats: 'minimal',
    lazy: false,
    compress: true
  }

  new WebpackDevServer(webpack(HARNESS), config).listen(HARNESS_PORT, 'localhost', (err) => {
    if(err) throw new gutil.PluginError('serve:harness', err)

    gutil.log('webpack-dev-server', `The Wallet Harness runs on http://localhost:${HARNESS_PORT}`)
  })
})
