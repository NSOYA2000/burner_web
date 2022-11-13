'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9526 npm run dev OR npm run dev --port = 9526
const port = process.env.port || process.env.npm_config_port || 9526 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       // data: `@import "@/styles/variables.scss";`
  //     },
  //     postcss: {
  //       plugins: [
  //         require('postcss-px-to-viewport')({
  //           viewportWidth: 1920, //  设计稿的视口宽度
  //           viewportHeight: 1080, //  设计稿的视口高度
  //           unitPrecision: 3, // 单位转换后保留的小数位数
  //           viewportUnit: 'vw', // 转换后的视口单位
  //           selectorBlackList: ['.ignore', '.hairlines'], // 不进行转换的css选择器，继续使用原有单位
  //           minPixelValue: 1, // 设置最小的转换数值
  //           mediaQuery: false, // 设置媒体查询里的单位是否需要转换单位
  //           exclude: /(\/|\\)(node_modules)(\/|\\)/ // 忽略第三方
  //         })
  //       ]
  //     }
  //   }
  // },
  devServer: {
    port: port,
    open: true,
    proxy: {
      '/zhangyong': {
        target: 'http://47.101.57.60:18005',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/zhangyong': ''
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // main是入口js文件
    // config.entry.app = ['babel-polyfill', './src/main.js']
    // config.entry('main').add('babel-polyfill')

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  },
  transpileDependencies: [
    '@packy-tang'
    // /[/\\]node_modules[/\\]test[/\\]/,
    // /[/\\]node_modules[/\\][@\\]test2[/\\]test3[/\\]/,
  ]
}
