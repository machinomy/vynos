const   path            = require("path"),
        webpackConfig   = require('./webpack.config');

module.exports = webpackConfig({
    harness: path.resolve(__dirname, "harness/harness.ts"),
});