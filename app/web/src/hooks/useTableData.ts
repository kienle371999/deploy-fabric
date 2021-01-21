import { ref } from 'vue';

export interface ISimpleTableData {
  city: string;
  totalOrders: string;
  editMode: boolean;
}

export interface IPaginatedTableData {
  picture: string;
  name: string;
  role: string;
  created: string;
  status: string;
  statusColor: string;
}

export interface IWideTableData {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
}

export interface IOrganization {
  organization: string
  ca_username: string
  ca_password: string
}

export interface IPeer {
  peer: string
  organization: string
  couchdb_username: string
  couchdb_password: string
}

export interface IOrder {
  peer: string
  order: string
}

export const organizationTableData = ref<IOrganization[]>([
  { organization: 'org1', ca_username: 'admin', ca_password: 'adminpw' }
]);

export const peerTableData = ref<IPeer[]>([
  { peer: 'peer0', organization: 'org1', couchdb_username: 'admin', couchdb_password: 'adminpw' }
]);

export const orderTableData = ref<IOrder[]>([
  { peer: 'peer0', order: 'order' }
]);


export function useTableData() {
  const simpleTableData = ref<ISimpleTableData[]>([
    { city: 'New York', totalOrders: '200,120', editMode: true },
    { city: 'Manchester', totalOrders: '632,310', editMode: true },
    { city: 'London', totalOrders: '451,110', editMode: true },
    { city: 'Madrid', totalOrders: '132,524', editMode: true },
  ]);

  const paginatedTableData = ref<IPaginatedTableData[]>([
    {
      picture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Vera Carpenter',
      role: 'Admin',
      created: 'Jan 21, 2020',
      status: 'Active',
      statusColor: 'green',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Blake Bowman',
      role: 'Editor',
      created: 'Jan 01, 2020',
      status: 'Active',
      statusColor: 'green',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Dana Moore',
      role: 'Editor',
      created: 'Jan 10, 2020',
      status: 'Suspended',
      statusColor: 'orange',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80',
      name: 'Alonzo Cox',
      role: 'Admin',
      created: 'Jan 18, 2020',
      status: 'Inactive',
      statusColor: 'red',
    },
  ]);

  const wideTableData = ref<IWideTableData[]>(
    [...Array(10).keys()].map(() => ({
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Software Engineer',
      title2: 'Web dev',
      status: 'Active',
      role: 'Owner',
      editMode: true
    }))
  );



  return {
    simpleTableData,
    paginatedTableData,
    wideTableData
  }
}
