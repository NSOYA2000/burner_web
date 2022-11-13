import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // console.log(roles, route.meta.roles, roles.some(role => route.meta.roles.includes(role.code)))
    return roles.some(role => route.meta.roles.includes(role.code))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // console.log('filterAsyncRoutes forEach', roles, tmp, tmp.meta && tmp.meta.roles)
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // console.log('filterAsyncRoutes push', tmp)
      res.push(tmp)
    }
  })
  // console.log('filterAsyncRoutes res', res)
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // console.log('generateRoutes', roles)
      // console.log('generateRoutes', asyncRoutes)
      // console.log('generateRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
