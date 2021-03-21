import { IExplorer } from '../hooks/useInterface'
import BaseRequest from "./foundation/BaseRequest"

class ExplorerRequest extends BaseRequest {
    getURL(url:string) {
        const baseUrl = import.meta.env.VITE_SERVER
        return baseUrl.concat(url)
    }
    async getExplorer() {
        const url = this.getURL('/api/explorer')
        return this.get(url)
    }
    async createExplorer(params: IExplorer) {
        const url = this.getURL('/api/explorer')
        return this.post(url, params)
    }
}

const instance = new ExplorerRequest()
export default instance