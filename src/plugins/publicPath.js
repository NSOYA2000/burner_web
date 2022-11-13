import Vue from 'vue'

const publicPath = process.env.VUE_APP_SERVICE_URL
function plugin(Vue, publicPath) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true

  Object.defineProperties(Vue.prototype, {
    $publicPath: {
      get() {
        return publicPath
      }
    }
  })
}

Vue.use(plugin, publicPath)
