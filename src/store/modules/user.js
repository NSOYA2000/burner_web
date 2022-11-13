import { getInfo, generateMyIDRequest } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {},
    groupInfo: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_GROUP_INFO: (state, groupInfo) => {
    state.groupInfo = groupInfo
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!getToken()) {
        return
      }
      // console.log('token', getToken())
      getInfo()
        .then(response => {
          // console.log("获取用户信息返回的结果是", response);
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          // console.log(data);
          const employeeInfoResponseDTO = data['employeeInfoResponseDTO'] || {}
          const {
            firstName,
            lastName,
            gid,
            headUrl,
            internetAddress
          } = employeeInfoResponseDTO
          commit('SET_NAME', firstName + ' ' + lastName + ' ' + gid)
          commit('SET_USER_INFO', {
            publisherName: lastName + ' ' + firstName,
            publisherGid: gid,
            email: internetAddress
          })
          commit('SET_AVATAR', headUrl)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      generateMyIDRequest(process.env.VUE_APP_SERVICE_URL).then(response => {
        const data = response.data || {}
        // console.log('退出登录返回的结果是', response)
        // console.log('退出登录返回的结果是', data.myIdUrl)
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve(data.myIdUrl)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
