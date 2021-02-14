const Channel = require('../../models/channel.model')
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const ObjectId = require('mongoose').Types
const Promise = require('bluebird')
const yaml = require('js-yaml')
const fs = require('fs')
const { spawnSync } = require("child_process")

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const createChannel = async(args) => {
  const validateArgs = async(args) => {
  console.log("🚀 ~ file: channel.service.js ~ line 17 ~ validateArgs ~ args", args)
    const { name, network, orgs } = args
    if(!_vArgs(name)) throw new Error('Channel name must be non-empty')
    if(!_vArgs(network)) throw new Error('Network Name must be non-empty')
    if(!Array.isArray(orgs) || orgs.length === 0) throw new Error('Organization must be array')

    const vNetwork = await Network.findOne({ name: network })
    if(!vNetwork) throw new Error('Network ID is not found')
    await Promise.each(orgs, async(org) => {
      const vOrg = await Organization.findOne({ name: org })
      if(!vOrg) throw new Error('Organization is not found')
    })
    return args
  }

  const { name, network, orgs } = await validateArgs(args)
  const alteredOrgIds = await Promise.map(orgs, async(orgName) => {
    const organization = await Organization.findOne({ name: orgName })
    return organization._id
  })
  const existedNetwork = await Network.findOne({ name: network })

  try {
    const channel = await Channel.create({
      name,
      network: existedNetwork._id,
      organization: alteredOrgIds
    })
    
    const channelTemplate = { channel: { name, orgs } }
    const channelYaml = yaml.safeDump(channelTemplate)
    fs.writeFileSync('yaml-generation/channel-config.yaml', channelYaml, 'utf8')
    const channelPath = process.env.PWD.concat('/yaml-generation/channel-config.yaml')

    const bashRes = spawnSync('bash', ['../../../join-channel.sh', network.toLowerCase(), channelPath])
    if(bashRes.status !== 0) {
      console.log('Error', bashRes.stderr.toString())
      process.exit()
    }
    else {
      console.log('System-data', bashRes.stdout.toString())
      console.log('Blockchain-data', bashRes.stderr.toString())
      return 'Successfully join channel'
    }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    createChannel
}