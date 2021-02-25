const Channel = require('../../models/channel.model')
const Network = require('../../models/network.model')
const { defaultNetwork } = require('../../utils/constant')
const getChannel = async() => {
  try {
    const network = await Network.findOne({ name: defaultNetwork })
    if(!network) throw new Error('Network must be created')
    const channels = await Channel
    .find({ network: network._id })
    .populate('organizations')
    
    filteredChannels = channels.map(channel => {
      return {
        _id: channel._id,
        name: channel.name,
        orgs: channel.organizations.map(org => org.name)
      }
    })
    return filteredChannels

  }
  catch(error) {
    throw new Error(error.message)
  }
}

module.exports = {
    getChannel
}