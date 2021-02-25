

class LocalStorageSetting {
  _setToken(token: string) {
    return localStorage.setItem('access_token', token)
  }
  _getAccessToken() {
    return localStorage.getItem('access_token')
  }
  _clearToken() {
    return localStorage.removeItem('access_token')
  }
  _setError(orgErrors: Object, channelErrors: Object) {
    return localStorage.setItem('config_error', JSON.stringify({ orgErrors, channelErrors }))
  }
  _getError() {
    const configError = localStorage.getItem('config_error')
    return configError ? JSON.parse(configError) : null
  }
  _clearError() {
    return localStorage.removeItem('config_error')
  }
}

const  localStorageSetting = new LocalStorageSetting()
export default localStorageSetting