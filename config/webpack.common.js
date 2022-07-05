// webpack公用配置

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveApp } = require('./paths')
const paths = require('./paths')
const path = require('path')

const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载

const ctx = {
  isEnvDevelopment: process.env.NODE_ENV === 'development',
  isEnvProduction: process.env.NODE_ENV === 'production',
}

const {
  isEnvDevelopment,
  isEnvProduction
} = ctx

module.exports = {
  // 入口
  entry:{
    index:"./src/index.tsx"
  },
  // 输出
  output:{
    // 仅在生产环境添加hash
    filename:isEnvDevelopment ? 'js/[name].[contenthash].bundle.js' : 'js/[name].bundle.js',
    path: paths.appDist,
    // 编译前清除目录
    clean: true,
    // publicPath: isEnvProduction ? 'https://xxx.com' : '', 关闭该 CDN 配置，因为示例项目，无 CDN 服务。
  },
  plugins:[
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      inject: true,
      title:'DEMO',
      favicon: path.resolve(paths.appPublic, 'favicon.ico'),
      template: paths.appHtml,
    }),
    // 进度条
    new ProgressBarPlugin({
      format:`:msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    }),
    new MiniCssExtractPlugin()
  ],
  resolve:{
    symlinks:false,
    extensions:['.tsx','.ts','.js'],
    alias:{
      '@': paths.appSrc, // @ 代表src路劲
      '~': paths.appSrcAssets, // ~ 代表src/assets路劲
    },
    extensions:['.tsx','.js'], // extensions 表示需要解析的文件类型列表。  由于 webpack 的解析顺序是从左到右，因此要将使用频率高的文件类型放在左侧，如下我将 tsx 放在最左侧。
    modules:[ // modules 表示 webpack 解析模块时需要解析的目录,指定目录可缩小 webpack 解析范围，加快构建速度。
      'node_modules',
      paths.appSrc
    ],
  },
  cache:{ // 使用文件缓存 可大大提高构建速度（时间上），第二次构建会使用之前的缓存文件
    type:'filesystem'
  },
  module:{
    rules:[
      {//将 images 图像混入我们的系统中
        test:/\.(png|svg|jpg|jpeg|gif)$/i,
        // include:paths.appSrc,
        // type:'asset/resource',
        use:[
          {
            loader: 'url-loader',
            options: {
              esModule: false,// 关闭es6模块化
              limit: 8 * 1024, // 图片大小小于8kb，就会被base64处理 优点：减少请求数量（减轻服务器压力） 缺点：图片体积会更大（文件请求速度更慢）
              include: paths.appSrc,
              name: 'images/[name].[ext]',
            },
          }
        ]
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
          isEnvProduction && MiniCssExtractPlugin.loader, // 仅生产环境   注意：MiniCssExtractPlugin.loader 要放在 style-loader 后面。
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
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 2
            }
          },
          // 将 Sass 编译成 CSS
          'sass-loader',
        ].filter(Boolean)
      },
      {
        test:/\.(js|tsx|ts|jsx)$/,
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
      },
    ]
  }
}