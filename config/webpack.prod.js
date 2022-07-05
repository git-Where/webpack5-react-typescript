/**
 * 生产环境配置
 * 
 * 为加快生产环境打包速度，不为生产环境配置 devtool
 * **/ 

const { merge } = require('webpack-merge')
const paths = require('./paths')

const common = require('./webpack.common')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const TerserPlugin = require('terser-webpack-plugin')

const glob = require('glob')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common,{
  // 生产模式
  mode: 'production',
  plugins:[
    // 打包体积分析（需要进行打包体积优化的时候在打开，不需要默认不打开）
    // new BundleAnalyzerPlugin()
    // 提取css
    new MiniCssExtractPlugin({
      filename:"[hash].[name].css"
    }),
    // css tree shaking
    new PurgeCSSPlugin({
      paths: glob.sync(`${paths.appSrc}/**/`, { nodir: true })
    })
  ],
  optimization:{ // 体积优化第一步是压缩代码，通过 webpack 插件，将 JS、CSS 等文件进行压缩
    minimizer:[
      // 压缩js
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      // 压缩css   将在 Webpack 构建期间搜索 CSS 文件，优化、压缩 CSS
      new CssMinimizerPlugin({
        parallel:4
      })
    ],
    splitChunks:{ // 抽离重复代码
      chunks:'all',
      //重复打包问题
      cacheGroups:{
        vendors:{ // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          // name:"vendors", // 一定不要定义固定的name
          priority:10, // 优先级
          enforce:true
        }
      }
    },
    runtimeChunk: true, // 通过配置 optimization.runtimeChunk = true，为运行时代码创建一个额外的 chunk，减少 entry chunk 体积，提高性能
    moduleIds: 'deterministic',
  },
})

