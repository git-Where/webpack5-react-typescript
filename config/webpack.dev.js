// 开发环境配置

const { merge } = require('webpack-merge')
const { resolveApp } = require('./paths')

const common = require('./webpack.common')

module.exports = merge(common,{
  // 开发模式
  mode: 'development',
  // 开发工具，开启 source map，编译调试(将编译后的代码映射回原始源代码)
  devtool:'eval-cheap-module-source-map',
  devServer:{
     // 告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要。
     static:'./dist'
  },
  // 输出
  output:{
    // bundle文件名称
    filename:'[name].bundle.js',

    //bundle 文件路劲
    path:resolveApp('dist'),

    // 编译前清除目录
    clean:true
  }
})