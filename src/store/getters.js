const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo
  // groupInfo: state => state.user.groupInfo
};
export default getters;
