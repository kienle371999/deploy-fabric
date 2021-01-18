const { status, role } = require('../../utils/constant')
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const Peer = require('../../models/peer.model')

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const addNetwork = async (args) => {
  const validateArgs = async (args) => {
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
  
    organizations.forEach(async (org, index) => {
      const newOrg = await Organization.create({ 
        network_id: newNetwork._id,
        name: org.org_name,
        role: role.organization
      })
      await Peer.create({
        org_id: newOrg._id,
        name: `peer${index}.${org}`,
        status: status.new
      })
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

const getNetwork
 = async() => {
  
}

module.exports = {
    addNetwork,
    getNetwork
}

