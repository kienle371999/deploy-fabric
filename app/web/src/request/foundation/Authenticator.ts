import axios from 'axios'

interface User {
  id: String,
  email: String,
  password: String,
  token: String
}

class Authenticator {
  _user: User
  env: String

  constructor () {
    this._init()
    this.env = import.meta.env.VITE_SERVER
  }

  _init () {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        this._user = JSON.parse(storedUser)
      } catch (error) {
        console.log('Invalid stored user: ' + storedUser)
        localStorage.removeItem('user')
        this._user = null
      }
    }
  }

  async logIn(params: Object) {
    return new Promise((resolve) => {
      axios.post(`${this.env}/api/user/signIn`, params)
        .then(response => {
          const user = response.data
          const userData = JSON.stringify(user)
          this._user = JSON.parse(userData)
          localStorage.setItem('user', userData)
          resolve(user)
        })
        .catch(err => {
          return err.message
        })
    })
  }

  logOut() {
    this.removeUser()
    return 'Done'
  }

  removeUser() {
    localStorage.removeItem('user')
  }
}

const auth = new Authenticator()
export default auth
