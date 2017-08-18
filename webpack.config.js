const   path                    = require("path"),
        webpack                 = require("webpack"),
        packageJson             = require('./package.json'),
        DIST_PATH               = path.resolve(__dirname, "dist"),
        PackageLoadersPlugin    = require('webpack-package-loaders-plugin');

const   CONTRACT_ADDRESS_PLACEHOLDER    = '[DEFAULT_CONTRACT_ADDRESS]',
        RPC_URL_PLACEHOLDER             = '[DEFAULT_RPC_URL]';

let     CONTRACT_ADDRESS                = null,
        RPC_URL                         = JSON.stringify('https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH');

if (packageJson.custom.contract_address !== CONTRACT_ADDRESS_PLACEHOLDER) {
    CONTRACT_ADDRESS = JSON.stringify(packageJson.custom.contract_address)
}

if (packageJson.custom.rpc_url !== RPC_URL_PLACEHOLDER) {
    RPC_URL = JSON.stringify(packageJson.custom.rpc_url)
}

module.exports = function webpackConfig (entry) {
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
                "window.RPC_URL": RPC_URL,
                "self.CONTRACT_ADDRESS": CONTRACT_ADDRESS,
            }),
            new PackageLoadersPlugin()
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loaders: [
                        "react-hot-loader/webpack",
                        "ts-loader"
                    ]
                },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
                {
                    test: /\.css$/i,
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
                                    require("postcss-import")(),
                                    // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                                    require("postcss-nesting")(),
                                    //https://github.com/ai/browserslist
                                    require("autoprefixer")({
                                        browsers: ['last 2 versions', 'ie >= 9']
                                    })
                                ])
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    exclude: [path.resolve(__dirname, "ynos"), path.resolve(__dirname, "harness")],
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
                                    require("postcss-import")({
                                        //If you are using postcss-import v8.2.0 & postcss-loader v1.0.0 or later, this is unnecessary.
                                        //addDependencyTo: webpack // Must be first item in list
                                    }),
                                    require("postcss-nesting")(),  // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                                    require("autoprefixer")({
                                        browsers: ['last 2 versions', 'ie >= 9'] //https://github.com/ai/browserslist
                                    })
                                ])
                            }
                        }
                    ]
                },
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