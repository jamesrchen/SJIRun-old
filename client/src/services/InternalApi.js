import API from './Api'

export default {
  getAuthState() {
    return API().get('getAuthState')
  },
  getUserInfo() {
    return API().get('getUserInfo')
  },
  getLeaderboard(sort){
    return API().get('getLeaderboard', { params: {
      sort: sort
    }})
  }
}