import { IChannel } from '../hooks/useInterface'
import BaseRequest from "./foundation/BaseRequest"

class ChannelRequest extends BaseRequest {
    getURL(url:string) {
        const baseUrl = import.meta.env.VITE_SERVER
        return baseUrl.concat(url)
    }
    async getChannel() {
        const url = this.getURL('/api/channel')
        return this.get(url)
    }
}

const instance = new ChannelRequest()
export default instance