import RequestNetwork from '../request/NetworkRequest'
import { IOrder, IOrganization, IPeer } from './useInterface'


export async function useNetworkData(networkId) {
  const orgs = await RequestNetwork.getNetworkById(networkId, 'organization')
  const vOrgs: IOrganization[] = []
  orgs.forEach(org => {
    vOrgs.push({ 
      _id: org._id, 
      network_id: org.network, 
      organization: org.name, 
      ca_username: org.ca_username, 
      ca_password: org.ca_password, 
      ca_port: org.ca_port 
    })
  })

  const peers = await RequestNetwork.getNetworkById(networkId, 'peer')
  const vPeers: IPeer[] = []
  peers.forEach(peer => {
    vPeers.push({ 
      _id: peer._id, 
      network_id: peer.network, 
      peer: peer.name, 
      organization_id: peer.organization._id, 
      organization: peer.organization.name, 
      couchdb_username: 
      peer.couchdb_username, 
      couchdb_password: peer.couchdb_password, 
      couchdb_port: peer.couchdb_port 
    })
  })

  const orders = await RequestNetwork.getNetworkById(networkId, 'order')
  const vOrders: IOrder[] = []
  orders.forEach(order => {
    vOrders.push({ 
      _id: order._id, 
      network_id: order.network, 
      peer: order.name, 
      order: order.organization.name 
    })
  })
  
  return  {
    organizations: vOrgs,
    peers: vPeers,
    orders: vOrders,
  }
} 