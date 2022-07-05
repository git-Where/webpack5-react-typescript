// 开发环境配置

const { merge } = require('webpack-merge')

const common = require('./webpack.common')

const webpack = require('webpack')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 编译进度分析，可以看到各个 loader、plugin 的构建时长
const smp = new SpeedMeasurePlugin()

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isNeedSpeed = false // 是否需要打开编译进度分析

const devConfig = merge(common,{
  // 开发模式
  mode: 'development',
  // 开发工具，开启 source map，编译调试(将编译后的代码映射回原始源代码)
  devtool:'eval-cheap-module-source-map',
  devServer:{
    // 告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要。
    static:'./dist',
    compress: true, // 是否使用gzip压缩
    port: 3000, // 设置端口号
    hot:true // 热更新
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(), // 根据devserver的配置hot，只更新修改的组件代码
    new ReactRefreshWebpackPlugin()
  ]
})

module.exports = isNeedSpeed ? smp.wrap(devConfig) : devConfig