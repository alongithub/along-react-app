const webpack = require('webpack');
module.exports = {
    devServer: {
        port: 8006,
        progress: true,
        contentBase: './build', // 静态服务文件夹,如果存在该文件夹，静态服务则会以此文件夹作为根路径
        open: true,
        historyApiFallback: true,
        // 讲错误信息输出到页面上显示
        overlay: {
            warnings: true,
            errors: true
        },
        // publicPath: '',
        // 跨域代理
        proxy: {
            '/api': {
                target: 'http://localhost:8089',
                // pathRewrite: {
                //     '/api': '',
                // }
            }
        }
    },
    // 开发环境中使用devtool做源码映射
    // source-map  大而全 单独生成源码map文件, 标识錯誤的列和行
    // eval-source-map 同上，但是产生单独的文件，将映射打包到打包后的js文件里
    // cheap-module-source-map  单独文件，不会映射列
    // cheap-module-eval-source-map 不产生文件，不映射列
    devtool: 'cheap-module-source-map',
    // watch: true, // 监控代码变化实时打包
    // watchOptions: {
    //     // 忽略监视node_modules中的文件
    //     ignored: /node_modules/,
    //     // aggregateTimeout: 500,  // 文件变化时防抖，500ms内没有再次变化再执行打包
    // },
    module: {
        rules: [
            {
                test: /\.css|less$/,
                use: [
                    // loader的执行顺序从后向前
                    'style-loader', // 将样式插入到head标签中
                    'css-loader', // 解析css中@import语法
                    'postcss-loader', // 添加样式前缀
                    'less-loader', // 解析less文件
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};