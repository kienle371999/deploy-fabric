import { IParams } from '../hooks/useInterface'
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
    async getNetwork() {
        const url = this.getURL('/api/network/')
        return this.get(url)
    }
    async getNetworkByArg(networkArg: string) {
        const url = this.getURL(`/api/network/${networkArg}`)
        return this.get(url)
    }
    async editNetwork(params: IParams) {
        const url = this.getURL(`/api/network/${params.type}`)
        return this.put(url, params.data)
    }
    async deleteNetwork(params: IParams) {
        const url = this.getURL(`/api/network/${params.type}`)
        return this.delete(url, params.data)
    }
    async startNetwork() {
        const url = this.getURL(`/api/start-network`)
        return this.post(url)
    }
    async stopNetwork() {
        const url = this.getURL(`/api/stop-network`)
        return this.post(url)
    }
}

const instance = new NetworkRequest()
export default instance