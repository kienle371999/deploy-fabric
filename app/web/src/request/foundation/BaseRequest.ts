import * as _ from 'lodash'
import axios from 'axios'
import auth from './Authenticator'

class BaseRequest {
  get(url: String, params: Object) {
    return this._doRequest('GET', url, { params })
  }

  delete(url: String, params:Object = {}) {
    return this._doRequest('DELETE', url, { params })
  }

  put(url: String, data: Object = {}) {
    return this._doRequest('PUT', url, { data })
  }

  post(url:String, data: Object = {}) {
    return this._doRequest('POST', url, { data })
  }

  _doRequest(method: String, url: String, paramsConfig: Object) {
    const headers = {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + this._getAuthToken()
    }

    const config: any = _.assign({
      method,
      url,
      headers
    }, paramsConfig)

    return new Promise((resolve) => {
      axios(config).then(response => {
        if (!response.data) {
          return
        }
        resolve(response.data)
      })
      .catch(err => {
        if (err.response.status === 401) {
          return auth.removeUser()
        }
      })
    })
  }

  _getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user ? user.token : ''
  }
}

export default BaseRequest
