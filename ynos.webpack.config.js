const   path            = require("path"),
        webpackConfig   = require('./webpack.config');

require('dotenv').config({ path: 'app.config.env' });


const YNOS_LIVE_WEBPACK_CONFIG = webpackConfig({
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

const YNOS_WEBPACK_CONFIG = webpackConfig({
    ynos: path.resolve(__dirname, "ynos/ynos.ts"),
    frame: path.resolve(__dirname, "ynos/frame.ts"),
    worker: path.resolve(__dirname, "ynos/worker.ts")
});


module.exports.YNOS_LIVE_WEBPACK_CONFIG = YNOS_LIVE_WEBPACK_CONFIG;
module.exports.YNOS_WEBPACK_CONFIG = YNOS_WEBPACK_CONFIG;