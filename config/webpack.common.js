// webpack公用配置

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveApp } = require('./paths')
const paths = require('./paths')

module.exports = {
  // 入口
  entry:{
    index:"./src/index.js"
  },
  plugins:[
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      title:'页面title'
    })
  ],
  resolve:{
    extensions:['.tsx','.ts','.js']
  },
  module:{
    rules:[
      {//将 images 图像混入我们的系统中
        test:/\.(png|svg|jpg|jpeg|gif)$/i,
        include:paths.appSrc,
        type:'asset/resource'
      },
      {// 使用 Asset Modules 接收字体文件
        test:/\.(woff|woff2|eot|ttf|otf)$/i,
        include:[resolveApp('src')],
        type:'asset/resource'
      },
      { // 在 JavaScript 模块中 import 一个 CSS 文件
        test:/\.css$/,
        include:paths.appSrc,
        use:[
          // 将js字符串生成为style节点
          'style-loader',
          // 将css转化成commonJs模块
          'css-loader'
        ]
      },
      { // 强化 CSS 的辅助工具
        test: /.(scss|sass)$/,
        include:paths.appSrc,
        use:[
          // 将js字符串生成为style节点
          'style-loader',
          // 将css转化成commonJs模块
          'css-loader',
          // 将sass 编译成css
          'sass-loader'
        ]
      },
      { // PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具
        test:/\.module\.{scss|sass}$/,
        include:paths.appSrc,
        use:[
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
            options: {
              // Enable CSS Modules features
              modules: true,
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          // 将 PostCSS 编译成 CSS
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // postcss-preset-env 包含 autoprefixer
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          // 将 Sass 编译成 CSS
          'sass-loader',
        ]
      },
      {
        test:/\/(js|tsx|ts|jsx)$/,
        include:paths.appSrc,
        use:[
          {
            loader:'esbuild-loader',
            options:{
              loader:'tsx',
              target:'es2015'
            }
          }
        ]
      }
    ]
  }
}