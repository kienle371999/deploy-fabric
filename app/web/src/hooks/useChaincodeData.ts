import ChaincodeRequest from '../request/ChaincodeRequest'
import ChannelRequest from '../request/ChannelRequest'

const chaincodes = async() => {
    const vChaincodes = await ChaincodeRequest.getChaincode()
    const vChannels = await ChannelRequest.getChannel()
    return {
        vChaincodes,
        vChannels
    }
}

export { chaincodes }