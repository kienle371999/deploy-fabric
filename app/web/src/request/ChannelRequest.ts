import { IChannel } from '../hooks/useInterface'
import BaseRequest from "./foundation/BaseRequest"

class ChannelRequest extends BaseRequest {
    getURL(url:string) {
        const baseUrl = import.meta.env.VITE_SERVER
        return baseUrl.concat(url)
    }
    async createChannel(params: IChannel) {
        const url = this.getURL('/api/channel')
        return this.post(url, params)
    }
}

const instance = new ChannelRequest()
export default instance