const { badRequest, serverError, success } = require('../../utils/messageHandle')
const { status, role } = require('../../utils/constant')
const Network = require('../../models/network.model')
const Organization = require('../../models/organization.model')
const Peer = require('../../models/peer.model')

const _validArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const addNetwork = async (args) => {
  const validateArgs = async (args) => {
    const { network_name, organizations, order } = args

    if (!_validArgs(network_name)) return badRequest('Network Name must be non-empty')
    organizations.forEach(org => {
      if(!_validArgs(org.org_name)) return badRequest('Organization Name must be non-empty')
      if(!_validArgs(org.number_peers)) return badRequest('Organization Peers must be non-empty')
    })
    if (!_validArgs(order.order_name)) return badRequest('Order Name must be non-empty')
    if (!_validArgs(order.number_peers)) return badRequest('Order Peers must be non-empty')

    try {
      const network = await Network.findOne({ name: network_name })
      if(network) return badRequest('Duplicate Network')
    }
    catch(error) {
      return serverError(error.message)
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

    return success(newNetwork)
  }
  catch(error) {
    return serverError(error.message)
  }
}

const getNetwork = async() => {
  
}

module.exports = {
    addNetwork,
    getNetwork
}

