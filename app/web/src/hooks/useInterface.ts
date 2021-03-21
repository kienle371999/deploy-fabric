export interface IOrganization {
    _id: string
    network_id: string
    organization: string
    number_peers:string
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

export interface IParams {
   data: Object
   type: string
}

export interface IChannel {
   name: string
   orgs: string[]
}

export interface IChaincode {
   name: string
   channel: string
   path?: string
   status?: string
}

export interface INetworkButton {
   color: string
   message: string
}

export interface IExplorer {
   name: string
   port: string
}