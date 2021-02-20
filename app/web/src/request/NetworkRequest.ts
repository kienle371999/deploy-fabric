import { INetwork, IParams } from '../hooks/useInterface'
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
    async getNetworkById(networkId:string, networkArg: string) {
        const url = this.getURL(`/api/network/${networkId}/${networkArg}`)
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
    async startNetwork(networkId: string) {
        const url = this.getURL(`/api/start-network/${networkId}`)
        return this.post(url)
    }
}

const instance = new NetworkRequest()
export default instance