import * as _ from 'lodash'
import axios from 'axios'
import auth from './Authenticator'
import localStorageSetting from '../../utils/LocalStorageSetting'

class BaseRequest {
  async get(url: String, data: Object = {}) {
    return this._doRequest('GET', url, { data })
  }

  async delete(url: String, data:Object = {}) {
    return this._doRequest('DELETE', url, { data })
  }

  async put(url: String, data: Object = {}) {
    return this._doRequest('PUT', url, { data })
  }

  async post(url:String, data: Object = {}) {
    return this._doRequest('POST', url, { data })
  }

  async _doRequest(method: String, url: String, paramsConfig: Object) {
    const headers = {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + auth._getAuthToken()
    }

    const config: Object = Object.assign({
      method,
      url,
      headers
    }, paramsConfig)

    try {
      const res = await axios(config)
      return res.data
    }
    catch(error) {
      if (error.response.status === 401) {
        localStorageSetting._clearToken()
      }
      return 
    }
  }
}

export default BaseRequest
