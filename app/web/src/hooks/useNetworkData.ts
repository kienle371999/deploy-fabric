import { ChannelRequest } from '../request'
import RequestNetwork from '../request/NetworkRequest'
import { IOrder, IOrganization, IPeer, IChannel } from './useInterface'

const organizations = async() => {
  try {
    const orgs = await RequestNetwork.getNetworkByArg('organization')
    const vOrgs: IOrganization[] = orgs.map(org => {
      return {
        _id: org._id, 
        network_id: org.network, 
        organization: org.name, 
        number_peers: org.number_peers,
        ca_username: org.ca_username, 
        ca_password: org.ca_password, 
        ca_port: org.ca_port 
      }
    })
    return vOrgs
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const peers = async() => {
  try {
    const peers = await RequestNetwork.getNetworkByArg('peer')
    const vPeers: IPeer[] = peers.map(peer => {
      return {
        _id: peer._id, 
        network_id: peer.network, 
        peer: peer.name, 
        organization_id: peer.organization._id, 
        organization: peer.organization.name, 
        couchdb_username: peer.couchdb_username, 
        couchdb_password: peer.couchdb_password, 
        couchdb_port: peer.couchdb_port 
      }
    })
    return vPeers
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const channels = async() => {
  try {
    const channels = await ChannelRequest.getChannel()
    const vChannels: IChannel[] = channels.map(channel => {
      return {
        name: channel.name,
        orgs: channel.orgs
      }
    })
    return vChannels
    }
  catch(error) {
    throw new Error(error.message)
  }
}

const order = async() => {
  try {
    const order = await RequestNetwork.getNetworkByArg('order')
    const vOrder: IOrder = {
      _id: order[0]._id, 
      network_id: order[0].network, 
      peer: order[0].name, 
      order: order[0].organization.name 
    }
    console.log(vOrder)
    return vOrder
    }
  catch(error) {
    throw new Error(error.message)
  }
}

const useNetworkData = async(type: string) => {
  if(type === 'networkSetup') {
    return { 
      vOrgs: await organizations(), 
      vPeers: await peers(),
      vOrder: await order(),
    }
  }
  if(type === 'networkConfiguration') {
    return { 
      vOrgs: await organizations(), 
      vPeers: await peers(),
      vOrder: await order(),
      vChannels: await channels()
    }
  }
}

export { useNetworkData }