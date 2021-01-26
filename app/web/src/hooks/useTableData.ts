import RequestNetwork from '../request/NetworkRequest'
export interface IOrganization {
  _id: string
  network_id: string
  organization: string
  ca_username: string
  ca_password: string
  ca_port: string
}

export interface IPeer {
  _id: string
  network_id: string
  peer: string
  organization_id: string
  organization: string
  couchdb_username: string
  couchdb_password: string
  couchdb_port: string
}

export interface IOrder {
  _id: string
  network_id: string
  peer: string
  order: string
}

export interface INetwork {
  _id: string
  name: string
  status: string
}

export interface IParams {
  data: Object
  type: string
}

export async function useTableData() {
  const orgs = await RequestNetwork.getNetwork('organization')
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

  const peers = await RequestNetwork.getNetwork('peer')
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

  const orders = await RequestNetwork.getNetwork('order')
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