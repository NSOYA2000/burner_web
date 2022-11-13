import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import groupInfo from './modules/groupInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    user,
    groupInfo
  },
  getters
})
console.log(store)
export default store
