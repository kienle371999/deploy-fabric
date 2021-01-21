const { status, role, model } = require('../../utils/constant')
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const Peer = require('../../models/peer.model')

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const addNetwork = async(args) => {
  const validateArgs = async(args) => {
    const { network_name, organizations, order } = args

    if (!_vArgs(network_name)) throw new Error('Network Name must be non-empty')
    organizations.forEach(org => {
      if(!_vArgs(org.org_name)) throw new Error('Organization Name must be non-empty')
      if(!_vArgs(org.number_peers)) throw new Error('Organization Peers must be non-empty')
    })
    if (!_vArgs(order.order_name)) throw new Error('Order Name must be non-empty')
    if (!_vArgs(order.number_peers)) throw new Error('Order Peers must be non-empty')

    try {
      const network = await Network.findOne({ name: network_name })
      if(network) throw new Error('Duplicate Network')
    }
    catch(error) {
      throw new Error(error.message)
    }
    return args
  }

  const { network_name, organizations, order, user } = await validateArgs(args)
  try {
    const newNetwork = await Network.create({
      user_id: user._id,
      name: network_name,
      status: status.new
    })
  
    organizations.forEach(async(org, index) => {
      const newOrg = await Organization.create({ 
        network_id: newNetwork._id,
        name: org.org_name,
        role: role.organization
      })

      for (var i = 0; i < parseInt(org.number_peers); i++) {
        await Peer.create({
          org_id: newOrg._id,
          network_id: newNetwork._id,
          name: `peer${i}`,
          status: status.new
        })
      }    
    })

    await Organization.create({
      network_id: newNetwork._id,
      name: order.order_name,
      role: role.order
    })

    return newNetwork
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const getNetwork = async(args) => {
  const { user } = args
  try {
    const network = await Network.findOne({ user_id: user._id })
    if(!network) throw new Error('Network is not found')

    const organizations = await Organization.find({ network_id: network._id })
    if(organizations.length === 0) throw new Error('Organization is not found')

    const peers = await Peer.find({ network_id: network._id })
    if (peers.length === 0) throw new Error('Peer is not found')

    return { network, organizations, peers }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const updateNetwork = async(args) => {
  const validateArgs = (args) => {
    const { network } = args
    const { organizations, peers } = network

    organizations.forEach(org => {
      if(!_vArgs(org.name)) throw new Error('Organization Name must be non-empty')
      if(org.role === role.organization) {
        if(!_vArgs(org.ca_username)) throw new Error('CA Username must be non-empty')
        if(!_vArgs(org.ca_password)) throw new Error('CA Password must be non-empty')
      }
    })

    peers.forEach(peer => {
      if(!_vArgs(peer.name)) throw new Error('Peer Name must be non-empty')
      if(!_vArgs(peer.couchdb_username)) throw new Error('CouchDB Name must be non-empty')
      if(!_vArgs(peer.couchdb_password)) throw new Error('CouchDB Password must be non-empty')
    })
    return args
  }

  const { network } = validateArgs(args)
  const { organizations, peers } = network

  try {
    organizations.forEach(async(org) => {
      const searchedOrg = await Organization.findById(org._id)
      if(searchedOrg.length === 0) throw new Error('Organization is not found')

      searchedOrg.name = org.name
      if(searchedOrg.role === role.organization) {
        searchedOrg.ca_username = org.ca_username
        searchedOrg.ca_password = org.ca_password
      }
      searchedOrg.save()
    })

    peers.forEach(async(peer) => {
      const searchedPeer = await Peer.findById(peer._id)
      if(searchedPeer.length === 0) throw new Error('Peer is not found')

      searchedPeer.name = peer.name
      searchedPeer.couchdb_username = peer.couchdb_username
      searchedPeer.couchdb_password = peer.couchdb_password
      searchedPeer.save()
    })

    return { network }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    addNetwork,
    getNetwork,
    updateNetwork
}

