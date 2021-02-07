<template>
 <div class="mt-8">
    <div class="mt-4">
      <div class="pb-6 pt-6 pl-12 pr-12 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Network Setup' }}</h3>
        <div class="flex flex-col mt-6">
          <div class="grid grid-cols-5 mb-8">
            <span class="cursor-pointer duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[componentName === 'NetworkSetupOrg' ? activeClass : inactiveClass]"
            @click="changeComponent('NetworkSetupOrg')">
            <p class="text-center">{{ 'Organization' }}</p>
          </span>
          <span class="cursor-pointer duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[componentName === 'NetworkSetupPeer' ? activeClass : inactiveClass]"
            @click="changeComponent('NetworkSetupPeer')">
            <p class="text-center">{{ 'Peer' }}</p>
          </span>
          <span class="cursor-pointer duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[componentName === 'NetworkSetupOrder' ? activeClass : inactiveClass]"
            @click="changeComponent('NetworkSetupOrder')">
            <p class="text-center">{{ 'Order' }}</p>
          </span>
          <button class="col-span-2 ml-auto mr-0 mt-3 w-1/3 bg-green-500 rounded-md text-white focus:outline-none font-medium tracking-wide hover:bg-green-500"
            @click="start()">{{ 'Start Network' }}
          </button>
        </div>
        <div v-if="componentName === 'NetworkSetupOrg'" class="py-4 overflow-x-auto">
          <div class="align-middle inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="table-fixed w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 w-1/5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                  <th class="px-6 py-3 w-1/5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'CA Username' }}</th>
                  <th class="px-6 py-3 w-1/5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'CA Password' }}</th>
                  <th class="px-6 py-3 w-1/5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'CA Port' }}</th>
                  <th class="px-6 py-3 w-1/5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Action' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(element, index) in organizationTableData" :key="index">
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span >{{ element.organization }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.ca_username }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.ca_password }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.ca_port }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="inline-block mr-3" @click="editValue(element, 'organization')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                    </span>
                    <span class="inline-block" @click="deleteValue(element, 'organization')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="componentName === 'NetworkSetupPeer'" class="py-4 overflow-x-auto">
          <div class="align-middle inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="table-fixed w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Peer' }}</th>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'CouchDB Username' }}</th>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'CouchDB Password' }}</th>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Status' }}</th>
                  <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Action' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(element, index) in peerTableData" :key="index">
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <span>{{ element.peer }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.organization }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.couchdb_username }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.couchdb_password }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.couchdb_port }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="inline-block mr-3" @click="editValue(element, 'peer')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                    </span>
                    <span class="inline-block" @click="deleteValue(element, 'peer')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="componentName === 'NetworkSetupOrder'" class="py-4 overflow-x-auto">
          <div class="align-middle inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="table-fixed w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 w-1/4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Peer' }}</th>
                  <th class="px-6 py-3 w-1/4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                  <th class="px-6 py-3 w-1/4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Status' }}</th>
                  <th class="px-6 py-3 w-1/4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Action' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(element, index) in orderTableData" :key="index">
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="flex items-center">
                      <span>{{ element.peer }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.order }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.order }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="inline-block mr-3" @click="editValue(element, 'order')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <editable-modal v-if="edit" :data="passedData" :type="passedType" @close="close"/>
  <delete-modal v-if="remove" :data="passedData" :type="passedType" @close="close"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import NetworkRequest from "../request/NetworkRequest";
import { EditableModal, DeleteModal } from "../modals";
import { useTableData, IOrganization, IPeer, IOrder } from "../hooks/useTableData";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    EditableModal,
    DeleteModal
  },
  async setup() {
    const route = useRoute()
    const activeClass = ref('border-gray-900')
    const inactiveClass = ref('')
    const componentName = ref<String>('NetworkSetupOrg')
    const edit = ref<Boolean>(false)
    const remove = ref<Boolean>(false)
    const passedData = ref<any>(null)
    const passedType = ref<String>('')
    const organizationTableData = ref<IOrganization[]>([])
    const orderTableData = ref<IOrder[]>([])
    const peerTableData = ref<IPeer[]>([])

    async function crawlData() {
      const { organizations, orders, peers } = await useTableData(route.params.networkId)
      organizationTableData.value = organizations
      orderTableData.value = orders
      peerTableData.value = peers
    }

    console.log('--------', organizationTableData)

    onMounted(async() => {
      await crawlData()
    })
    computed(async(remove) => {
      await crawlData()
    })

    function changeComponent(name) {
      componentName.value = name
    }
    function editValue(data, type) {
      passedData.value = data
      passedType.value = type
      edit.value = true 
    }

    function deleteValue(data, type) {
      passedData.value = data
      passedType.value = type
      remove.value = true 
    }

    async function start() {
      await NetworkRequest.startNetwork({ _id: '600eb8ea9a4dbcf7a59956b6' , name: 'kien', status: 'New' })
    }

    async function close() {
      await crawlData()
      edit.value = false
      remove.value = false
    }

    return { 
      organizationTableData,
      orderTableData,
      peerTableData,
      activeClass,
      inactiveClass,
      changeComponent,
      componentName,
      edit,
      remove,
      editValue,
      deleteValue,
      passedData,
      passedType,
      start,
      close
    }
  }
});
</script>