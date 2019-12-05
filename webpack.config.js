const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2)); // 获取参数
const _mode = argv.mode || 'development';
const _isEnvDevelopment = _mode === 'development';
const _isEnvProduction = _mode === 'production';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);

const HtmlWebpackPlugin = require('html-webpack-plugin');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');






const baseConfig = {
    mode: _mode,
    entry: {
        home: './src/index.js',
    },
    output: {
        filename: 'js/[name].[hash:8].js',
        // 打包文件路径 该路径为绝对路径
        path: path.resolve(__dirname, 'build'),
        pathinfo: true,
        // 静态资源引用会统一加一个路径，比如加上cdn地址
        // publicPath: 'http://www.baidu.com',
        publicPath: _isEnvDevelopment ? '/' : '/build/'
    },
    resolve: {
        // 指定类似import from 'axios'这种未指定模块路径的引入方式要从node_modules中检索
        // modules: [path.resolve('node_modules')], // 这样配置会导致react-router munus中的redirect报错
        // mainFiles: ['index'], // 指定入口文件名字，默认index.js
        // 指定别名
        alias: {
            '@images': path.resolve(__dirname, 'src/images'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@pages': path.resolve(__dirname, 'src/pages'),
        },
        extensions: ['.js'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.MODE': JSON.stringify('development'), // 或者写成 "'development'"
        }),
        // 如果是多页应用，应当new多个HtmlWebpackPlugin实例，并分别指定template、filename、chunks
        new HtmlWebpackPlugin({
            // 模板html路径
            template: './public/index.html',
            filename: 'index.html', // 打包后的文件名称
            minify: _isEnvProduction ? { // 压缩html production 环境配置此项
                removeAttributeQuotes: true, // 去除双引号 
                collapseWhitespace: true, // 折叠空行
                hash: true, // 插入js在？后加一个hash戳，防止缓存，当然也可以每次生成js时在文件名引入hash
            } : {}
            //chunks: ['home'], // 指定html模板要引入的js文件，名字与入口中的文件名对应，一般在打包多页应用时会用到，默认没有该配置会引入所有入口文件
        }),
        new WebpackBuildNotifierPlugin({
            title: _mode + ' pack ',
            suppressSuccess: true // 显示成功
        })
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 200 * 1024,
                        outputPath: 'images/',
                        name: '[name].[hash:5].[ext]',
                        publicPath: '', // 可以写cdn地址
                    }
                }
            },
            {
                test: /\.js$/,
                enforce: 'pre', // 代表 在js的所有loader中最先执行
                loader: 'eslint-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [
                                "import",
                                {
                                    "libraryName": "antd",
                                    "style": "css"
                                }
                            ],
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties"],
                            ["@babel/plugin-transform-runtime"]
                        ]
                    }
                },
            }
        ]
    }
}

module.exports = smp.wrap(merge(_mergeConfig, baseConfig));