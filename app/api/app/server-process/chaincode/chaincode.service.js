const Chaincode = require('../../models/chaincode.model')
const Channel = require('../../models/channel.model')
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const yaml = require('js-yaml')
const _ = require('lodash')
const fs = require('fs')
const { spawnSync, spawn } = require("child_process")
const { defaultNetwork, chaincode, status } = require('../../utils/constant')
const Promise = require('bluebird')

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const getChaincode = async() => {
  try {
    const network = await Network.findOne({ name: defaultNetwork })
    if(!network) return []
    
    const chaincodes = await Chaincode
    .find({ network: network._id })
    .populate({
      path: 'channel',
      select: 'name'
    })
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

    const existedPath = await Chaincode.findOne({ path: path })
    if(existedPath) throw new Error('Duplicate Chaincode Path')
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
  if(network.status !== status.running) throw new Error('Network must run before installing chaincode')

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

const startChaincode = async(args) => {
  const { chaincodeId, channelName } = args
  const vChaincode = await Chaincode.findById(chaincodeId)
  if(vChaincode.status === chaincode.instantiation) return vChaincode 

  try {
    const channel = await Channel.findOne({ name: channelName })
    const filterOrgs = await Promise.map(channel.organizations, async(orgId) => {
      const organization = await Organization.findById(orgId)
      return organization.name
    })

    const network = await Network.findOne({ name: defaultNetwork })
    const templateConfig = { 
      chaincodes: [{
      Name: vChaincode.name,
      Channel: channel.name,
      Orgs: filterOrgs
      }] 
    }

    console.log(templateConfig)

    const yamlStr = yaml.safeDump(templateConfig)
    fs.writeFileSync('yaml-generation/chaincode-config.yaml', yamlStr, 'utf8')
    const configPath = process.env.PWD.concat('/yaml-generation/chaincode-config.yaml')
    const explorerPath = process.env.PWD.concat('/yaml-generation/explorer-config.yaml')
  
    const res = spawnSync('bash', ['../../../instantiate-chaincode.sh', network.name.toLowerCase(), configPath, explorerPath])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
      return await Chaincode.findByIdAndUpdate(chaincodeId, { status: chaincode.instantiation })
    }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    getChaincode,
    createChaincode,
    startChaincode
}