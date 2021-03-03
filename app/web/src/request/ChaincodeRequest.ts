import { IChaincode } from './../hooks/useInterface';
import BaseRequest from "./foundation/BaseRequest"

class ChannelRequest extends BaseRequest {
    getURL(url:string) {
        const baseUrl = import.meta.env.VITE_SERVER
        return baseUrl.concat(url)
    }
    async getChaincode() {
        const url = this.getURL('/api/chaincode')
        return this.get(url)
    }
    async creatChaincode(params: IChaincode) {
        const url = this.getURL('/api/chaincode')
        return this.post(url, params)
    }
}

const instance = new ChannelRequest()
export default instance