/**
 * 生产环境配置
 * 
 * 为加快生产环境打包速度，不为生产环境配置 devtool
 * **/ 

const { merge } = require('webpack-merge')

const common = require('./webpack.common')
const { resolveApp } = require('./paths')

module.exports = merge(common,{
  // 生产模式
  mode: 'production',
  // 输出
  output:{
    // bundle文件名称   生产环境需要生成唯一hash值，来记录缓存文件跟改变的文件
    filename:'[name].[contenthash].js',

    //bundle 文件路劲
    path:resolveApp('dist'),

    // 编译前清除目录
    clean:true
  },
})

