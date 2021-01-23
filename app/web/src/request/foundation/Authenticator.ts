import axios from 'axios'
import localStorageSetting from '../../utils/LocalStorageSetting'
class Authenticator {
  env: string

  constructor () {
    this.env = import.meta.env.VITE_SERVER
  }

  async logIn(params: Object) {
    try {
      const user = await axios.post(`${this.env}/api/signIn`, params)
      localStorageSetting._setToken(JSON.stringify(user.data.token))
      return user
    }
    catch(error) {
      return 
    }
  }

  async authenticateToken() {
    try {
      const currentToken = this._getAuthToken()
      const vToken = await axios.post(`${this.env}/api/authenticateToken`, { currentToken })
      return vToken
    }
    catch(error) {
      localStorageSetting._clearToken()
      return 
    }
  }

  logOut() {
    localStorageSetting._clearToken()
  }

  _getAuthToken() {
    const access_token = JSON.parse(localStorageSetting._getAccessToken())
    return access_token 
  }
}

const auth = new Authenticator()
export default auth
