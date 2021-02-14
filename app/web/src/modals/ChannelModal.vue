<template>
  <div class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
    <div class="modal-container bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
      <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center">
          <p class="p-4 text-2xl font-bold">{{ 'Add Channel' }}</p>
          <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </div>
        </div>
        <!--Body-->
        <div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="org_name">{{ 'Channel' }}</label>
            <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text" v-model="channelData.name"/>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'Network' }}</label>
            <multi-select class="mt-2"
              v-model="network"
              mode="tags"
              placeholder="Select networks"
              @select="chooseOrg()"
              :options="networkOptions"/>
          </div>
          <div class="px-4 py-3">
            <label class="text-gray-700" for="number_peers">{{ 'Organization' }}</label>
            <multi-select class="mt-2"
              v-model="channelData.orgs"
              mode="tags"
              :allow-empty="true"
              placeholder="Select organizations"
              :options="orgOptions"/>
          </div>
        </div>
        <!--Footer-->
        <div class="flex justify-end pt-3 px-4">
          <button @click="$emit('close')" class="px-6 py-3 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">{{ 'Close' }}</button>
          <button @click="save()" class="px-6 py-3 bg-indigo-600 rounded-md text-white font-medium tracking-wide hover:bg-indigo-500">{{ 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NetworkRequest, ChannelRequest } from '../request'
import { IChannel } from '../hooks/useInterface'

export default defineComponent ({
  emits: ['close'],
  async setup(props, context) {
    const channelData = ref<IChannel>({
      name: '',
      network: '',
      orgs: []
    })
    const network = ref<String[]>([])
    const orgOptions = ref<String[]>([])
    const networkData = await NetworkRequest.getNetwork()
    const networkOptions = ref<String[]>(networkData.map(data => {
      return {
        value: data.name,
        label: data.name
      }
    }))

    function chooseOrg() {
      const selectedNetwork = networkData.filter(data => data.name === network.value[0])
      orgOptions.value = selectedNetwork[0].organizations.map(org => {
      return {
        value: org.name,
        label: org.name
        }
      })
    }
    async function save() {
      channelData.value.network = network.value[0].toString()
      console.log(channelData.value)
      await ChannelRequest.createChannel(channelData.value)
    }

    return {
      channelData,
      networkOptions,
      orgOptions,
      networkData,
      chooseOrg,
      network,
      save
    }
  },
})
</script>
<style>
.multiselect-options {
  overflow: hidden !important;
}
</style>
