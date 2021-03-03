import ChaincodeRequest from '../request/ChaincodeRequest'

const chaincodes = async() => {
    const vChaincodes = await ChaincodeRequest.getChaincode()
    return vChaincodes
}

export { chaincodes }