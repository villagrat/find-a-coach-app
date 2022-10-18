let timer

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
    })
  },
  logout(context){
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiration')

    clearTimeout(timer)

    context.commit('setUser', {
      userId: null,
      token: null,
    })
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    })
  },
  async auth(context, payload){
    const mode = payload.mode
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLYagZdKtNHFJA46EmRIVR0b15TAJhKUY'

    if (mode === 'signup'){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLYagZdKtNHFJA46EmRIVR0b15TAJhKUY'
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(error.message || 'Something went wrong.')

      throw error
    }

    // + syntax to convert to a number
    const expiresIn = +responseData.expiresIn * 1000
    const expirationDate = new Date().getTime() + expiresIn

    // use localStorage to persist user session
    localStorage.setItem('token', responseData.idToken)
    localStorage.setItem('userId', responseData.localId)
    localStorage.setItem('tokenExpiration', expirationDate)

    timer = setTimeout(function() {
      context.dispatch('autoLogout')
    }, expiresIn)

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
    })
  },
  tryLogin(context){
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    // + syntax to convert to a number
    const expiresIn = +tokenExpiration - new Date().getTime()

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch('autoLogout')
    }, expiresIn)

    if (token && userId){
      context.commit('setUser', {
        token,
        userId,
        tokenExpiration: null
      })
    }
  },
  autoLogout(context) {
    context.dispatch('logout')
    context.commit('setAutoLogout')
  }
}