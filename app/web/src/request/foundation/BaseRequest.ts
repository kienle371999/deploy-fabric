import * as _ from 'lodash'
import axios from 'axios'
import auth from './Authenticator'
import localStorageSetting from '../../utils/LocalStorageSetting'

class BaseRequest {
  async get(url: string, data: Object = {}) {
    return this._doRequest('GET', url, { data })
  }

  async delete(url: string, data:Object = {}) {
    return this._doRequest('DELETE', url, { data })
  }

  async put(url: string, data: Object = {}) {
    return this._doRequest('PUT', url, { data })
  }

  async post(url:string, data: Object = {}) {
    return this._doRequest('POST', url, { data })
  }

  async _doRequest(method: string, url: string, paramsConfig: Object) {
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
      console.log("_doRequest -> error", error)
      if (error.response.status === 401) {
        localStorageSetting._clearToken()
      }
      throw new Error(error.response.data) 
    }
  }
}

export default BaseRequest
