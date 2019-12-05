const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 压缩抽离的css文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 压缩js
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: 'readme.txt',
            to: ''
        }]),
        // 抽离css为单独的文件
        new MiniCssExtractPlugin({
            // 抽离文件名称
            filename: 'css/style.css'
        }),
        // 打包文件顶部添加注释
        new webpack.BannerPlugin("build by along at " + new Date().toLocaleString()),
        new ProgressBarPlugin()
    ],
    optimization: {
        minimizer: [
            new UglifyJsWebpackPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true,
                    },
                    output: null, // 去掉注释
                }
                // sourceMap: true,
            }),
            new OptimizeCssAssetsWebpackPlugin({})
        ],
        splitChunks: { // 分割代码块
            cacheGroups: { // 缓存组
                commos: { // 公共的模块
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 2, // 至少使用过多少次
                    name: '[name]',
                },
                vendor: {
                    priority: 1, // 权重优先级
                    test: /node_modules/,
                    chunks: 'initial',
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.css|less$/,
                use: [
                    // loader的执行顺序从后向前
                    MiniCssExtractPlugin.loader, // 抽离文件通过link引入
                    'css-loader', // 解析css中@import语法
                    'postcss-loader', // 添加样式前缀
                    'less-loader', // 解析less文件
                ]
            }
        ]
    }
};