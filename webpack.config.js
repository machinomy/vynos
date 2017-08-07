const   path                    = require("path"),
        webpack                 = require("webpack"),
        PackageLoadersPlugin    = require('webpack-package-loaders-plugin'),
        packageJson             = require('./package.json'),
        DIST_PATH               = path.resolve(__dirname, "dist"),
        autoprefixer            = require('autoprefixer-stylus'),
        ExtractTextPlugin       = require('extract-text-webpack-plugin');

const   CONTRACT_ADDRESS_PLACEHOLDER    = '[DEFAULT_CONTRACT_ADDRESS]',
        RPC_URL_PLACEHOLDER             = '[DEFAULT_RPC_URL]';

const   styleSource                     = path.resolve(__dirname, 'ynos/frame/css/style.styl');

let     CONTRACT_ADDRESS                = null,
        RPC_URL                         = JSON.stringify('https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH');

if (packageJson.custom.contract_address !== CONTRACT_ADDRESS_PLACEHOLDER) {
    CONTRACT_ADDRESS = JSON.stringify(packageJson.custom.contract_address)
}

if (packageJson.custom.rpc_url !== RPC_URL_PLACEHOLDER) {
    RPC_URL = JSON.stringify(packageJson.custom.rpc_url)
}

module.exports = function webpackConfig (entry) {
    //entry.style = styleSource;
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
                "window.FRAME_URL": JSON.stringify(`http://localhost:${process.env.FRAME_PORT}/frame.html`),
                "window.RPC_URL": RPC_URL,
                "self.CONTRACT_ADDRESS": CONTRACT_ADDRESS,
            }),
            new PackageLoadersPlugin()
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json", ".styl"]
        },
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loaders: [
                        "react-hot-loader/webpack",
                        "ts-loader"
                    ]
                },
                {
                    test: /\.styl$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'stylus-loader',
                            options: {
                                use: [autoprefixer({browsers: ['last 2 versions', 'ie >= 9']})],
                            }
                        },
                    ],
                },
                { test: /\.(eot|woff|woff2|svg|ttf|png)([\?]?.*)$/, loader: "file-loader" },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
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