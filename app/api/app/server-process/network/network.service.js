const { status, role, model, domain, defaultNetwork } = require('../../utils/constant')
const { ObjectId } = require('mongoose').Types
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const Peer = require('../../models/peer.model')
const User = require('../../models/user.model')
const Channel = require('../../models/channel.model')
const yaml = require('js-yaml')
const _ = require('lodash')
const fs = require('fs')
const { spawnSync, spawn } = require("child_process")
const Promise = require('bluebird')
 
const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const addNetwork = async(args) => {
  const validateArgs = async(args) => {
    const { network_name, organizations, order, channels } = args

    if (!_vArgs(network_name)) throw new Error('Network Name must be non-empty')
    organizations.forEach(org => {
      if(!_vArgs(org.org_name)) throw new Error('Organization Name must be non-empty')
      if(!_vArgs(org.number_peers)) throw new Error('Organization Peers must be non-empty')
    })
    channels.forEach(channel => {
      if(!_vArgs(channel.name)) throw new Error('Channel Name must be non-empty')
      if(!Array.isArray(channel.orgs) || channel.orgs.length === 0) throw new Error('Channel Orgnizations must be array')
    })
    if (!_vArgs(order.order_name)) throw new Error('Order Name must be non-empty')
    if (!_vArgs(order.number_peers)) throw new Error('Order Peers must be non-empty')

    try {
      const network = await Network.findOneAndDelete({ name: network_name })
      if(network) await Promise.all([
        Organization.deleteMany({ network: network._id }), 
        Peer.deleteMany({ network: network._id }), 
        Channel.deleteMany({ network: network._id })
      ])
    }
    catch(error) {
      throw new Error(error.message)
    }
    return args
  }

  const { network_name, organizations, order, user, channels } = await validateArgs(args)
  try {
    const newNetwork = await Network.create({
      user: user._id,
      name: network_name,
      status: status.new
    })
    await Promise.each(organizations, async(org) => {
      const newOrg = await Organization.create({ 
        network: newNetwork._id,
        name: org.org_name,
        role: role.organization
      })
      for (var i = 0; i < parseInt(org.number_peers); i++) {
        await Peer.create({ 
          organization: newOrg._id,
          network: newNetwork._id,
          name: `peer${i}`
        })
      }
    })
    
    const orderOrg = await Organization.create({
      network: newNetwork._id,
      name: order.order_name,
      role: role.order
    })
    await Peer.create({
      organization: orderOrg._id,
      network: newNetwork._id,
      name: `peer0`,
      status: status.new
    })

    const newChannel = await Promise.map(channels, async(channel) => {
      const alteredOrgIds = await Promise.map(channel.orgs, async(orgName) => {
        const organization = await Organization.findOne({ name: orgName })
        return organization._id
      })
      
      const vChannel = await Channel.findOne({ name: channel.name })
      if(vChannel) throw new Error('Channel Name must be distinct')

      const newChannel = await Channel.create({
        name: channel.name,
        network: newNetwork._id,
        organizations: alteredOrgIds
      })
      return newChannel
    })

    return { newNetwork, newChannel }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const getNetwork = async(args) => {
  const { user } = args
  const vUser = await User.findById(user._id)
  if(!vUser) throw new Error('User must be registered')

  try {
    const networks = await Network.aggregate(
      [
        {
          $match: {
            user: new ObjectId(user._id)
          } 
        },
        {
          $lookup: {
            from: 'organizations',
            localField: '_id',
            foreignField: 'network',
            as: 'organizations'
          }
        }
      ]
    )
    return networks.map(network => {
      const vOrg = []
      _.each(network.organizations, (org) => {
        if(org.role === role.organization) vOrg.push(org) 
      })
      network.organizations = vOrg
      return network
    })
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const getNetworkByArg = async(args) => {
  const validNetworkArg = [model.organization, model.peer, model.order, model.network]

  const validateArgs = async(args) => {
    const { networkArg, user } = args
    if(!_vArgs(networkArg)) throw new Error('Type must be non-empty')
    if(!validNetworkArg.includes(networkArg)) throw new Error('Type must be in this default array')

    const vUser = await User.findById(user._id)
    if(!vUser) throw new Error('User must be registered')
    return args
  }
  
  const { networkArg } = await validateArgs(args)
  const network = await Network.findOne({ name: defaultNetwork })
  if(!network) return []

  try {
    if(networkArg === validNetworkArg[0]) {
      const orgs = await Organization.find({ network: network._id, role: role.organization })
      const filteredOrgs = await Promise.map(orgs, async(org) => {
        const peerCount = await Peer.countDocuments({ organization: org._id })
        return { number_peers: peerCount.toString(), ...org._doc }
      })
      return filteredOrgs
    }
    else if(networkArg === validNetworkArg[1]) {
      const peers = await Peer
      .find({ network: network._id })
      .populate({
        path: model.organization,
        match: { role: role.organization },
        select: 'name'
      })
      return peers.filter(peer => peer.organization)
    }
    else if(networkArg === validNetworkArg[2]) {
      const peerOrders = await Peer
      .find({ network: network._id })
      .populate({
        path: model.organization,
        match: { role: role.order },
        select: 'name'
      })
      return peerOrders.filter(peerOrder => peerOrder.organization)
    }
    else if(networkArg === validNetworkArg[3]) {
      return network
    }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const updateNetwork = async(args) => {
  const validNetworkArg = [model.organization, model.peer, model.order]

  const { networkArg, networkData } = args
  if(!_vArgs(networkArg)) throw new Error('Type must be non-empty')
  if(!validNetworkArg.includes(networkArg)) throw new Error('Type must be in this default array')
  
  if(networkArg === validNetworkArg[0]) {
    if(!_vArgs(networkData._id)) throw new Error('Organization ID must be non-empty')
    if(!_vArgs(networkData.organization)) throw new Error('Organization Name must be non-empty')
    if(!_vArgs(networkData.ca_username)) throw new Error('CA Username must be non-empty')
    if(!_vArgs(networkData.ca_password)) throw new Error('CA Password must be non-empty')
    if(!_vArgs(networkData.ca_port)) throw new Error('CA Port must be non-empty')

    const vCAPort = await Organization.findOne({ ca_port: networkData.ca_port })
    if(vCAPort) {
      if(vCAPort.id !== networkData._id) throw new Error('Duplicate CA Port')
    }
    const vCouchDBPort = await Peer.findOne({ couchdb_port: networkData.ca_port })
    if(vCouchDBPort) throw new Error('Duplicate CA Port')

    try {
      const vOrg = await Organization.findById(networkData._id)
      if(!vOrg) throw new Error('Organization is not found')

      vOrg.name = networkData.organization
      vOrg.ca_username = networkData.ca_username
      vOrg.ca_password = networkData.ca_password
      vOrg.ca_port = networkData.ca_port
      return vOrg.save()
    }
    catch(error) {
      console.log("🚀 ~ file: network.service.js ~ line 220 ~ updateNetwork ~ error", error)
      throw new Error(error.message)
    }
  }

  if(networkArg === validNetworkArg[1]) {
    if(!_vArgs(networkData._id)) throw new Error('Peer ID must be non-empty')
    if(!_vArgs(networkData.peer)) throw new Error('Peer Name must be non-empty')
    if(!_vArgs(networkData.couchdb_username)) throw new Error('Couch DB Username must be non-empty')
    if(!_vArgs(networkData.couchdb_password)) throw new Error('CouchDB Password must be non-empty')
    if(!_vArgs(networkData.couchdb_port)) throw new Error('CouchDB Port must be non-empty')

    
    const vCouchDBPort = await Peer.findOne({ couchdb_port: networkData.couchdb_port })
    if(vCouchDBPort) {
      if(vCouchDBPort.id !== networkData._id) throw new Error('Duplicate CouchDB Port')
    }
    const vCAPort = await Organization.findOne({ ca_port: networkData.couchdb_port })
    if(vCAPort) throw new Error('Duplicate CouchDB Port')

    try {
      const vPeer = await Peer.findById(networkData._id)
  

      if(!vPeer) throw new Error('Organization Peer is not found')
      vPeer.name = networkData.peer 
      vPeer.couchdb_username = networkData.couchdb_username 
      vPeer.couchdb_password = networkData.couchdb_password
      vPeer.couchdb_port = networkData.couchdb_port
      return vPeer.save()
    }
    catch(error) {
      throw new Error(error.message)
    }
  }

  if(networkArg === validNetworkArg[2]) {
    if(!_vArgs(networkData._id)) throw new Error('Peer ID must be non-empty')
    if(!_vArgs(networkData.peer)) throw new Error('Peer Name must be non-empty')
    if(!_vArgs(networkData.order)) throw new Error('Order Name must be non-empty')
    
    try {
      const vPeerOrder = await Peer
      .findById(networkData._id)
      .populate(model.organization)

      if(!vPeerOrder) throw new Error('Order Peer is not found')
      vPeerOrder.name = networkData.peer 
      vPeerOrder.save()

      if(vPeerOrder.organization.name !== networkData.organization) {
        await Organization.findByIdAndUpdate(vPeerOrder.organization._id, { name: networkData.order })
      }
      return await Peer
      .findById(networkData._id)
      .populate(model.organization)
    }
    catch(error) {
      throw new Error(error.message)
    }
  }
}

const deleteNetwork = async(args) => {
  const validNetworkArg = [model.organization, model.peer, model.order]

  const { networkArg, networkData } = args
  if(!_vArgs(networkArg)) throw new Error('Type must be non-empty')
  if(!validNetworkArg.includes(networkArg)) throw new Error('Type must be in this default array')

  if(networkArg === validNetworkArg[0]) {
    if(!_vArgs(networkData._id)) throw new Error('Organization ID must be non-empty') 
    try {
      const org = await Organization.findByIdAndDelete(networkData._id)
      if(!org) throw new Error('Organization is not found')
      return Peer.deleteMany({ organization: org._id })
    }
    catch(error) {
      throw new Error(error.message)
    }
  }

  if(networkArg === validNetworkArg[1]) {
    if(!_vArgs(networkData._id)) throw new Error('Peer ID must be non-empty') 
    if(!_vArgs(networkData.organization_id)) throw new Error('Organization ID must be non-empty') 

    try {
      const deletedPeer = await Peer.findByIdAndDelete(networkData._id)
      const peerOrg = await Peer.find({ organization: new ObjectId(networkData.organization_id) })
      if(!Array.isArray(peerOrg) || peerOrg.length === 0) {
        await Organization.findByIdAndDelete(networkData.organization_id)
        return deletedPeer
      }
      return deletedPeer
    }
    catch(error) {
      throw new Error(error.message)
    }
  }

  if(networkArg === validNetworkArg[2]) {
    throw new Error('Order must not be deleted')
  }
}

const startNetwork = async() => {
  const network = await Network.findOne({ name: defaultNetwork })
  if(!network) throw new Error('Network is not found')
  if(network.status === status.running) return network

  try {
    const templateConfig = { orgs: [], channels: [] }
    const organizations = await Organization.aggregate([
      { 
        $match: {
          network: network._id,
          role: role.organization
        } 
      },
      {
        $lookup: {
          from: 'peers',
          localField: '_id',
          foreignField: 'organization',
          as: 'peers'
        }
      }
    ])

    _.each(organizations, (org, index) => {
      templateConfig.orgs.push({ 
        Name: org.name, 
        Domain: org.name.concat(`.${domain}`), 
        PeerCount: 2, 
        CA: {
          username: org.ca_username,
          password: org.ca_password,
          port: parseInt(org.ca_port)
        },
        Peers: [],
        UserCount: 1
      })

      _.each(org.peers, (peer) => {
        templateConfig.orgs[index].Peers.push({
          Domain: peer.name.concat(`.${org.name}.${domain}`),
          CouchDB: {
            usename: peer.couchdb_username,
            password: peer.couchdb_password,
            port: parseInt(peer.couchdb_port)
          }
        })
      })
    })

    const channels = await Channel.find({ network: network._id }).populate('organizations')
    if(!Array.isArray(channels) || channels.length === 0) throw new Error('Channels must exsit')
    _.each(channels, (channel) => {
      templateConfig.channels.push({
        Name: channel.name,
        Orgs: channel.organizations.map(org => org.name)
      })
    })

    const yamlStr = yaml.safeDump(templateConfig)
    fs.writeFileSync('yaml-generation/network-config.yaml', yamlStr, 'utf8')
    const configPath = process.env.PWD.concat('/yaml-generation/network-config.yaml')
    console.log("startNetwork -> configPath", configPath)

    const res = spawnSync('bash', ['../../../create-network.sh', network.name.toLowerCase(), configPath])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
      return await Network.findByIdAndUpdate(network._id, { status: status.running })
    }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    addNetwork,
    getNetwork,
    getNetworkByArg,
    updateNetwork,
    deleteNetwork,
    startNetwork
}

