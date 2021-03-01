<template>
  <div class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
    <div class="modal-container bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
      <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50" @click="$emit('close')">
        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6" v-if="props.type === 'organization'">
        <!--Title-->
        <div class="flex justify-between items-center">
          <p class="p-4 text-2xl font-bold">{{ `Edit ${props.type}` }}</p>
          <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </div>
        </div>
        <!--Body-->
        <div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="org_name">{{ 'Organization' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md bg-gray-500" 
              type="text" 
              :disabled="true"
              v-model="props.data.organization"/>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CA Username' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[orgErrors.ca_username.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.ca_username"/>
            <div v-if="orgErrors.ca_username.status">
              <div class="mt-2 text-red-700">{{ orgErrors.ca_username.message }}</div>
            </div>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CA Password' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[orgErrors.ca_password.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.ca_password"/>
            <div v-if="orgErrors.ca_password.status">
              <div class="mt-2 text-red-700">{{ orgErrors.ca_password.message }}</div>
            </div>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CA Port' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[orgErrors.ca_port.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.ca_port"/>
            <div v-if="orgErrors.ca_port.status">
              <div class="mt-2 text-red-700">{{ orgErrors.ca_port.message }}</div>
            </div>
          </div>
        </div>
        <!--Footer-->
        <div class="flex justify-end pt-3 px-4">
          <button @click="$emit('close')" class="px-6 py-3 bg-transparent p-3 rounded-lg focus:outline-none text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">{{ 'Close' }}</button>
          <button @click="save()" class="px-6 py-3 bg-indigo-600 rounded-md text-white focus:outline-none font-medium tracking-wide hover:bg-indigo-500">{{ 'Save' }}</button>
        </div>
      </div>
      <div class="modal-content py-4 text-left px-6" v-if="props.type === 'peer'">
        <!--Title-->
        <div class="flex justify-between items-center">
          <p class="p-4 text-2xl font-bold">{{ `Edit ${props.type}` }}</p>
          <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </div>
        </div>
        <!--Body-->
        <div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="org_name">{{ 'Peer' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md bg-gray-500" 
              type="text" 
              :disabled="true"
              v-model="props.data.peer"/>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="org_name">{{ 'Organization' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md bg-gray-500" 
              type="text" 
              :disabled="true"
              v-model="props.data.organization"/>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CouchDB Username' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[peerErrors.couchdb_username.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.couchdb_username"/>
            <div v-if="peerErrors.couchdb_username.status">
              <div class="mt-2 text-red-700">{{ peerErrors.couchdb_username.message }}</div>
            </div>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CouchDB Password' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[peerErrors.couchdb_password.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.couchdb_password"/>
            <div v-if="peerErrors.couchdb_password.status">
              <div class="mt-2 text-red-700">{{ peerErrors.couchdb_password.message }}</div>
            </div>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'CouchDB Port' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[peerErrors.couchdb_port.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.couchdb_port"/>
            <div v-if="peerErrors.couchdb_port.status">
              <div class="mt-2 text-red-700">{{ peerErrors.couchdb_port.message }}</div>
            </div>
          </div>
        </div>
        <!--Footer-->
        <div class="flex justify-end pt-3 px-4">
          <button @click="$emit('close')" class="px-6 py-3 bg-transparent p-3 rounded-lg focus:outline-none text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">{{ 'Close' }}</button>
          <button @click="save()" class="px-6 py-3 bg-indigo-600 rounded-md text-white focus:outline-none font-medium tracking-wide hover:bg-indigo-500">{{ 'Save' }}</button>
        </div>
      </div>
      <div class="modal-content py-4 text-left px-6" v-if="props.type === 'order'">
        <!--Title-->
        <div class="flex justify-between items-center">
          <p class="p-4 text-2xl font-bold">{{ `Edit ${props.type}` }}</p>
          <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </div>
        </div>
        <!--Body-->
        <div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="org_name">{{ 'Peer' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[orderErrors.peer.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.peer"/>
            <div v-if="orderErrors.peer.status">
              <div class="mt-2 text-red-700">{{ orderErrors.peer.message }}</div>
            </div>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'Order' }}</label>
            <input 
              class="form-input w-full mt-2 rounded-md" 
              :class="[orderErrors.order.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
              type="text" 
              v-model="props.data.order"/>
            <div v-if="orderErrors.order.status">
              <div class="mt-2 text-red-700">{{ orderErrors.order.message }}</div>
            </div>
          </div>
        </div>
        <!--Footer-->
        <div class="flex justify-end pt-3 px-4">
          <button @click="$emit('close')" class="px-6 py-3 bg-transparent p-3 rounded-lg focus:outline-none text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">{{ 'Close' }}</button>
          <button @click="save()" class="px-6 py-3 bg-indigo-600 rounded-md text-white focus:outline-none font-medium tracking-wide hover:bg-indigo-500">{{ 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { validateForm } from '../utils/commonLib'
import { NetworkRequest } from '../request'

interface OrgError {
  ca_username: {
    status: boolean
    message: string
  }
  ca_password: {
    status: boolean
    message: string
  }
  ca_port: {
    status: boolean
    message: string
  }
}

interface PeerError {
  couchdb_username: {
    status: boolean
    message: string
  }
  couchdb_password: {
    status: boolean
    message: string
  }
  couchdb_port: {
    status: boolean
    message: string
  }
}

interface OrderError {
  peer: {
    status: boolean
    message: string
  }
  order: {
    status: boolean
    message: string
  }
}


export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup (props, context) {
    const startWatch = ref<Boolean>(false)
    const orgErrors = ref<OrgError>({ 
      ca_username: {
        status: false,
        message: ''
      },
      ca_password: {
        status: false,
        message: ''
      },
      ca_port: {
        status: false,
        message: ''
      },
    })
  
    const peerErrors = ref<PeerError>({ 
      couchdb_username: {
        status: false,
        message: ''
      },
      couchdb_password: {
        status: false,
        message: ''
      },
      couchdb_port: {
        status: false,
        message: ''
      }
    })

    const orderErrors = ref<OrderError>({ 
      peer: {
        status: false,
        message: ''
      },
      order: {
        status: false,
        message: ''
      }
    })

    function handleForm() {
      if(props.type === 'organization') {
        startWatch.value = true
        orgErrors.value.ca_username = validateForm('CA UserName', props.data.ca_username)
        orgErrors.value.ca_password = validateForm('CA Password', props.data.ca_password)
        orgErrors.value.ca_port = validateForm('CA Port', props.data.ca_port)
      }
      if(props.type === 'peer') {
        startWatch.value = true
        peerErrors.value.couchdb_username = validateForm('CouchDB UserName', props.data.couchdb_username)
        peerErrors.value.couchdb_password = validateForm('CouchDB Password', props.data.couchdb_password)
        peerErrors.value.couchdb_port = validateForm('CouchDB Port', props.data.couchdb_port)
      }
      if(props.type === 'order') {
        startWatch.value = true
        orderErrors.value.peer = validateForm('peer', props.data.peer)
        orderErrors.value.order = validateForm('order', props.data.order)
      }
    }

    function checkState() {
      let state: boolean = true

      if(props.type === 'organization') {
        if(orgErrors.value.ca_username.status) state = false
        if(orgErrors.value.ca_password.status) state = false
        if(orgErrors.value.ca_port.status) state = false
      }
      if(props.type === 'peer') {
        startWatch.value = true
        if(peerErrors.value.couchdb_username.status) state = false
        if(peerErrors.value.couchdb_password.status) state = false
        if(peerErrors.value.couchdb_port.status) state = false
      }
      if(props.type === 'order') {
        startWatch.value = true
        if(orderErrors.value.peer.status) state = false
        if(orderErrors.value.order.status) state = false
      }
      return state
    }

    watchEffect(() => {
      if(startWatch.value) {
        handleForm()
      }
    })

    async function save() {
      handleForm()
      if(checkState()) {
        try {
          await NetworkRequest.editNetwork(props)
          this.$toast.success(`Successfully edit ${props.type}`)
          context.emit('close')
        }
        catch(error) {
          this.$toast.error(error.message)
          return
        }
      }
    }
    return { 
      props, 
      save,
      orgErrors,
      peerErrors,
      orderErrors
    }
  }
})
</script>