const Chaincode = require('../../models/chaincode.model')
const Channel = require('../../models/channel.model')
const Network = require('../../models/network.model')
const fs = require('fs')
const { defaultNetwork, chaincode } = require('../../utils/constant')
require('dotenv').config({ path: require('find-config')('.env') })

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const getChaincode = async() => {
  try {
    const network = await Network.findOne({ name: defaultNetwork })
    if(!network) return []
    
    const chaincodes = await Chaincode.find({ network: network._id })
    return chaincodes

  }
  catch(error) {
    throw new Error(error.message)
  }
}

const createChaincode = async(args) => {
  const validateArgs = async(chaincodeArgs) => {
    const { name, channel, path } = chaincodeArgs
    if(!_vArgs(name)) throw new Error('Chaincode Name must be non-empty')
    if(!_vArgs(channel)) throw new Error('Channel Name must be non-empty')
    if(!_vArgs(path)) throw new Error('Chaincode Path must be non-empty')

    const existedChaincode = await Chaincode.findOne({ name: name })
    if(existedChaincode) throw new Error('Duplicate Chaincode Name')
    const existedChannel = await Channel.findOne({ name: channel })
    if(!existedChannel) throw new Error('Channel must exist')
    const fullPath = process.env.CHAINCODE_PATH.concat(path)
    if(!fs.existsSync(fullPath)) throw new Error('Chaincode Path do not exsit')
    return { 
      name, 
      channel: existedChannel, 
      path 
    }
  }

  const { name, channel, path } = await validateArgs(args)
  const network = await Network.findOne({ name: defaultNetwork })
  if(!network) throw new Error('Network must be found')

  try {
    const vChaincode = await Chaincode.create({
      name,
      path,
      channel: channel._id,
      network: network._id,
      status: chaincode.new
    })
    return {
      name,
      path,
      channel: channel.name,
      network: network.name,
      status: chaincode.new
    }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    getChaincode,
    createChaincode
}