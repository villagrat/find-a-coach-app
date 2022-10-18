export default  {
  userId(state) {
    return state.userId
  },
  token(state) {
    return state.token
  },
  isAuthenticated(state) {
    // !! to convert to Boolean
    return !!state.token
  },
  didAutoLogout(state) {
    return state.didAutoLogout
  }
}