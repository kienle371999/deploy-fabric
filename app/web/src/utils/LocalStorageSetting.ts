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
}

const  localStorageSetting = new LocalStorageSetting()
export default localStorageSetting