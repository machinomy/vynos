const   path            = require("path"),
        webpackConfig   = require('./webpack.config');

require('dotenv').config({ path: 'app.env' });

module.exports = webpackConfig({
    ynos: [
        `webpack-dev-server/client?http://localhost:${process.env.HARNESS_PORT}`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, "ynos/ynos.ts"),
    ],
    frame: [
        `webpack-dev-server/client?http://localhost:${process.env.FRAME_PORT}`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, "ynos/frame.ts")
    ],
    worker: [
        path.resolve(__dirname, "ynos/worker.ts")
    ]
});