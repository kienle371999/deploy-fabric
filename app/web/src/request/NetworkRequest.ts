import BaseRequest from "./foundation/BaseRequest"

class NetworkRequest extends BaseRequest {
    getURL(url:string) {
        const baseUrl = import.meta.env.VITE_SERVER
        return baseUrl.concat(url)
    }
    async addNetwork(params: Object) {
        const url = this.getURL('/api/network')
        return this.post(url, params)
    }
    async getNetwork(networkArg: String) {
        const url = this.getURL(`/api/network/${networkArg}`)
        return this.get(url)
    }
}

const instance = new NetworkRequest()
export default instance