import { getToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    groupInfo: []
  }
}

const state = getDefaultState()
const mutations = {
  SET_GROUP_INFO: (state, groupInfo) => {
    state.groupInfo = groupInfo
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
