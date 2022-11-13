// import 'babel-polyfill' // 看babel.config.js
// import 'core-js/stable' // 看babel.config.js文件 "corejs": 3 使用
// import 'regenerator-runtime/runtime' // 看babel.config.js文件 "corejs": 3 使用
import Vue from 'vue'

import VCalendar from 'v-calendar' // 引入日历插件

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'

import '@/icons' // icon
import '@/permission' // permission control

import '@/plugins/publicPath'
import '@/utils/watermark'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.prototype.$showLoading = function(loading, timeout = 5000) {
  this[loading] = true
  setTimeout(() => {
    this[loading] = false
  }, timeout)
}
Vue.prototype.$closeLoading = function(loading) {
  this[loading] = false
}
Vue.prototype.$copy = function(data) {
  const url = data
  const oInput = document.createElement('input')
  oInput.value = url
  document.body.appendChild(oInput)
  // 选择对象;
  oInput.select()
  // 执行浏览器复制命令
  document.execCommand('Copy')
  this.$message({
    message: '已成功复制到剪切板',
    type: 'success'
  })
  oInput.remove()
}
Vue.filter('emptyFilter', function(value) {
  return value || '--'
})

Vue.filter('dateFilter', function(time, delimiterDate = '-') {
  time = new Date(time)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  return year + delimiterDate + month + delimiterDate + day
})

Vue.filter('dateTimeFilter', function(
  time,
  delimiterDate = '-',
  delimiterTime = ':'
) {
  time = new Date(time)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return (
    year +
    delimiterDate +
    month +
    delimiterDate +
    day +
    ' ' +
    hour +
    delimiterTime +
    minute +
    delimiterTime +
    second
  )
})

Vue.config.productionTip = false
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下
Vue.use(VueTinymce) // 安装vue的tinymce组件

Vue.use(VCalendar, {
  componentPrefix: 'vc'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
