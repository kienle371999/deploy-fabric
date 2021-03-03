import { ChannelRequest } from '../request'
import RequestNetwork from '../request/NetworkRequest'
import { IOrder, IOrganization, IPeer, IChannel } from './useInterface'

const organizations = async() => {
  try {
    const orgs = await RequestNetwork.getNetworkByArg('organization')
    if(!Array.isArray(orgs) || orgs.length === 0) return []
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
    if(!Array.isArray(peers) || peers.length === 0) return []
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
    if(!Array.isArray(channels) || channels.length === 0) return []
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

const network = async() => {
  try {
    const network = await RequestNetwork.getNetworkByArg('network')
    if(!network) return null
    return network
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const orders = async() => {
  try {
    const orders = await RequestNetwork.getNetworkByArg('order')
    const vOrder: IOrder[] = orders.map(order => {
      return {
        _id: order._id, 
        network_id: order.network, 
        peer: order.name, 
        order: order.organization.name 
      }
    })
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
      vOrders: await orders(),
      vNetwork: await network()
    }
  }
  if(type === 'networkConfiguration') {
    return { 
      vOrgs: await organizations(), 
      vPeers: await peers(),
      vOrders: await orders(),
      vChannels: await channels()
    }
  }
}

export { useNetworkData }