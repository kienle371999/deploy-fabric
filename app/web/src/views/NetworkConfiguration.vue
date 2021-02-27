<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Network Configuration' }}</h3>
        <form @submit.prevent="register">
          <div class="m-8 border-2 border-gray-500">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8"
              v-for="(org, index) in organizations" :key="index">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Organization' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[orgErrors.organizations[index].org_name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  :disabled="configState"
                  type="text" 
                  v-model="organizations[index].org_name"/>
                <div v-if="orgErrors.organizations[index].org_name.status">
                  <div class="mt-2 text-red-700">{{ orgErrors.organizations[index].org_name.message }}</div>
                </div>
              </div>
              <div>
                <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[orgErrors.organizations[index].number_peers.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  :disabled="configState"
                  type="text" 
                  v-model="organizations[index].number_peers"/>
                <div v-if="orgErrors.organizations[index].number_peers.status">
                  <div class="mt-2 text-red-700">{{ orgErrors.organizations[index].number_peers.message }}</div>
                </div>
              </div>
            </div>
            <div class="flex pl-8 pb-6 pt-6">
              <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" 
                :disabled="configState"
                @click="addOrg()">{{ 'Add Organization' }}</button>
            </div>
          </div>
          <div class="m-8 border-2 border-gray-500">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8"
              v-for="(channel, index) in channels" :key="index">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Channel' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[channelErrors[index].name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  type="text" 
                  :disabled="configState"
                  v-model="channels[index].name"/>
                <div v-if="channelErrors[index].name.status">
                  <div class="mt-2 text-red-700">{{ channelErrors.channels[index].name.message }}</div>
                </div>
              </div>
              <div>
                <label class="text-gray-700" for="number_peers">{{ 'Organizations' }}</label>
                 <multi-select class="mt-2 border-red-600"
                    v-model="channels[index].orgs"
                    mode="tags"
                    :disabled="configState"
                    :allow-empty="true"
                    placeholder="Select"
                    :options="orgOptions"/>
              </div>
            </div>
            <div class="flex pl-8 pb-6 pt-6">
              <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" 
                @click="addChannel()">{{ 'Add Channel' }}</button>
            </div>
          </div>
          <div class="m-8 border-2 border-gray-500">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8 pb-8">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Order' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[orgErrors.order_name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  :disabled="configState"
                  type="text" 
                  v-model="order.order_name"/>
                <div v-if="orgErrors.order_name.status">
                  <div class="mt-2 text-red-700">{{ orgErrors.order_name.message }}</div>
                </div>
              </div>
              <div>
                <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                <input 
                class="form-input w-full mt-2 rounded-md bg-gray-500" 
                type="text" 
                :disabled="true" 
                v-model="order.number_peers"/>
              </div>
            </div>
          </div>
        </form>
      <div class="flex justify-center mt-4 pb-6">
        <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          v-if="configState"
          @click="reset()">{{ 'Reset Configuration' }}
        </button>
         <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          v-else
          @click="save()">{{ 'Save Configuration' }}
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue"
import { validateForm } from '../utils/commonLib'
import { useNetworkData } from "../hooks/useNetworkData"
import NetworkRequest from "../request/NetworkRequest"
import localStorageSetting from "../utils/LocalStorageSetting"

interface Organization {
  org_name: string,
  number_peers: string
}

interface Order {
  order_name: string,
  number_peers: string
}

interface Channel {
   name: string
   orgs: string[]
}

interface OrgError  {
  org_name: {
    status: boolean
    message: string
  }
  number_peers: {
    status: boolean
    message: string
  }
}

interface NetworkError {
  organizations: OrgError[]
  order_name: {
    status: boolean
    message: string
  }
}

interface ChannelError {
  name: {
      status: boolean
      message: string
    }
    orgs: {
      status: boolean
      message: string
    }
}

const validateData = (data: Object) => {
  const elements = Object.values(data)
  return elements.every(element => Array.isArray(element) && element.length !== 0)
}

const crawlData = async() => {
  try {
      let organizations: Organization[]
      let order: Order
      let channels: Channel[]

      const { vOrgs, vOrders, vChannels } = await useNetworkData('networkConfiguration')
      if(validateData({ vOrgs, vOrders, vChannels })) {
        organizations = vOrgs.map(org => {
          return {
            org_name: org.organization,
            number_peers: org.number_peers
          }
        })
        order = { order_name: vOrders[0].order, number_peers: '1' }
        channels = vChannels.map(channel => {
          return {
            name: channel.name,
            orgs: channel.orgs
          }
        })
        return { organizations, order, channels }
      }
      return false
    }
    catch(error) {
      return
    }
}

export default defineComponent({
  async setup() {
    const startWatch = ref<Boolean>(false)
    const configState = ref<Boolean>(false)
    const organizations = ref<Organization[]>([{  org_name: '', number_peers: '' }])
    const channels = ref<Channel[]>([{ name: '', orgs: [] }])
    const order = ref<Order>({ order_name: '', number_peers: '1' })
    const orgOptions = ref<Object[]>([])

    const orgErrors = ref<NetworkError>({
      organizations: [{ 
        org_name: {
          status: false,
          message: ''
        }, 
        number_peers: {
          status: false,
          message: ''
        } 
      }],
      order_name: {
        status: false,
        message: ''
      } 
    })
    const channelErrors = ref<ChannelError[]>([
      {
        name: {
          status: false,
          message: ''
        },
        orgs: {
          status: false,
          message: ''
        }
      }
    ])

    const crawledData = await crawlData()
    if(crawledData) {
      organizations.value = crawledData.organizations
      order.value = crawledData.order
      channels.value = crawledData.channels
    }
    else {
      localStorageSetting._clearError()
    }
     
    if(localStorageSetting._getError()) {
      const configError = localStorageSetting._getError()
      orgErrors.value = configError.orgErrors
      channelErrors.value = configError.channelErrors
      configState.value = true
    }

    function handleForm() {
      startWatch.value = true
      organizations.value.forEach((org, index) => {
        orgErrors.value.organizations[index].org_name = validateForm('organization', org.org_name)
        orgErrors.value.organizations[index].number_peers = validateForm('Number Peer', org.number_peers)
      })
      orgErrors.value.order_name = validateForm('order', order.value.order_name)
    }

    function checkState() {
      let state: boolean = true
      organizations.value.forEach((org, index) => {
        if(orgErrors.value.organizations[index].org_name.status) state = false
        if(orgErrors.value.organizations[index].number_peers.status) state = false
      })
      if(orgErrors.value.order_name.status) state = false
      return state
    }

    watchEffect(() => {
      if(startWatch.value) {
        handleForm()
      }
      if(organizations.value) {
        orgOptions.value = organizations.value.map(org => {
          return {
            value: org.org_name,
            label: org.org_name
          }
        })
      }
    })

    function addOrg() {
      organizations.value.push({ org_name: '', number_peers: '' })
      orgErrors.value.organizations.push({ 
        org_name: {
          status: false,
          message: ''
        },
        number_peers: {
          status: false,
          message: ''
        } 
      })
      startWatch.value = false
    }

    function addChannel() {
      channels.value.push({ name: '', orgs: [] })
      channelErrors.value.push({
        name: {
          status: false,
          message: ''
        },
        orgs: {
          status: false,
          message: ''
        }
      })
      startWatch.value = false
    }

    function reset() {
      configState.value = false
      organizations.value = [{ 
        org_name: '',
        number_peers: ''
      }]
      order.value = {
        order_name: '',
        number_peers: '1'
      }
      channels.value = [{
        name: '',
        orgs: []
      }]
      orgOptions.value = []
    }

    async function save() {
      handleForm()
      if(checkState()) {
        try {
          const res = await NetworkRequest.addNetwork({ organizations: organizations.value, order: order.value, channels: channels.value })
          if(res) {
            localStorageSetting._setError(orgErrors.value, channels.value)
            startWatch.value = false
            configState.value = true
            this.$toast.success('Successfully create network')
          }
        }
        catch(error) {
          this.$toast.error(error.message)
        }
      }
    }

    return { 
      organizations,
      channels, 
      order, 
      orgOptions,
      addOrg, 
      addChannel,
      save,
      reset, 
      orgErrors,
      channelErrors,
      configState 
    }
  }
})
</script>
