module.exports = {
  presets: [
    // 更多详情请看：https://cli.vuejs.org/zh/guide/browser-compatibility.html#browserslist
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    // '@vue/cli-plugin-babel/preset'
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'usage', // 'usage' | 'entry' | false
        'corejs': 3 // 2 or 3
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
    ]
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      'plugins': ['dynamic-import-node']
    }
  }
}
