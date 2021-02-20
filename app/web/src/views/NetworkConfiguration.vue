<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Network Configuration' }}</h3>
        <form @submit.prevent="register">
          <div class="pt-8 pl-8 w-2/5">
            <label class="text-gray-700" for="org_name">{{ 'Network' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[errors.network_name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="network_name"/>
            <div v-if="errors.network_name.status">
              <div class="mt-2 text-red-700">{{ errors.network_name.message }}</div>
            </div>
          </div>
          <div class="m-8 border-2 border-gray-500">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8"
              v-for="(org, index) in organizations" :key="index">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Organization' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[errors.organizations[index].org_name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  type="text" 
                  v-model="organizations[index].org_name"/>
                <div v-if="errors.organizations[index].org_name.status">
                  <div class="mt-2 text-red-700">{{ errors.organizations[index].org_name.message }}</div>
                </div>
              </div>
              <div>
                <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[errors.organizations[index].number_peers.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  type="text" 
                  v-model="organizations[index].number_peers"/>
                <div v-if="errors.organizations[index].number_peers.status">
                  <div class="mt-2 text-red-700">{{ errors.organizations[index].number_peers.message }}</div>
                </div>
              </div>
            </div>
            <div class="flex pl-8 pb-6 pt-6">
              <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" 
                @click="addOrg()">{{ 'Add Organization' }}</button>
            </div>
          </div>
          <div class="m-8 border-2 border-gray-500">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8 pb-8">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Order' }}</label>
                <input 
                  class="form-input w-full mt-2 rounded-md" 
                  :class="[errors.order_name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                  type="text" 
                  v-model="order.order_name"/>
                <div v-if="errors.order_name.status">
                  <div class="mt-2 text-red-700">{{ errors.order_name.message }}</div>
                </div>
              </div>
              <div>
                <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                <input class="form-input w-full mt-2 rounded-md bg-gray-500" type="text" :disabled="true" v-model="order.number_peers"/>
              </div>
            </div>
          </div>
        </form>
      <div class="flex justify-center mt-4 pb-6">
        <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
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
import { boolean } from "yup/lib/locale";
import NetworkRequest from "../request/NetworkRequest"

interface Organization {
  org_name: string,
  number_peers: string
}

interface Order {
  order_name: string,
  number_peers: string
}

interface NetworkError {
  network_name: {
    status: boolean
    message: string
  }
  organizations: [{
    org_name: {
      status: boolean
      message: string
    }
    number_peers: {
      status: boolean
      message: string
    }
  }]
  order_name: {
    status: boolean
    message: string
  }
}

export default defineComponent({
  setup() {
    const startWatch = ref<Boolean>(false)
    const organizations = ref<Organization[]>([{  org_name: '', number_peers: '' }])
    const order = ref<Order>({ order_name: '', number_peers: '1' })
    const network_name = ref<string>('')
    const errors = ref<NetworkError>({
      network_name: {
        status: false,
        message: ''
      },
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

    function handleForm() {
      startWatch.value = true
      errors.value.network_name = validateForm('network', network_name.value)
      organizations.value.forEach((org, index) => {
        errors.value.organizations[index].org_name = validateForm('organization', org.org_name)
        errors.value.organizations[index].number_peers = validateForm('Number Peer', org.number_peers)
      })
      errors.value.order_name = validateForm('order', order.value.order_name)
    }

    function checkState() {
      let state: boolean = true
      if(errors.value.network_name.status) state = false
      organizations.value.forEach((org, index) => {
        if(errors.value.organizations[index].org_name.status) state = false
        if(errors.value.organizations[index].number_peers.status) state = false
      })
      if(errors.value.order_name.status) state = false
      return state
    }

    watchEffect(() => {
      if(startWatch.value) {
        handleForm()
      }
    })

    function addOrg() {
      organizations.value.push({ org_name: '', number_peers: '' })
      errors.value.organizations.push({ 
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

    async function save() {
      handleForm()
      if(checkState()) {
        try {
          const res = await NetworkRequest.addNetwork({ network_name: network_name.value, organizations: organizations.value, order: order.value })
          if(res) {
            network_name.value = ''
            organizations.value = [{ 
              org_name: '',
              number_peers: ''
            }]
            order.value = {
              order_name: '',
              number_peers: '1'
            }
            startWatch.value = false
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
      order, 
      network_name, 
      addOrg, 
      save, 
      errors 
    }
  }
})
</script>

