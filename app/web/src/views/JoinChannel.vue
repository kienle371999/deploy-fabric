<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="pb-6 pt-6 pl-12 pr-12 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Channel' }}</h3>
         <button class="col-span-2 float-right h-12 w-40 bg-green-500 rounded-md text-white focus:outline-none font-medium tracking-wide hover:bg-green-500"
            @click="start()">{{ 'Create Channel' }}
          </button>
        <div class="align-middle mt-10 inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="table-fixed w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Channel' }}</th>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Network' }}</th>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(element, index) in channelData" :key="index">
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.channel }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.network }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <div v-for="(org, index) in element.organizations" :key="index">
                      <div class="py-2">{{ org.name }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.status }}</span>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <channel-modal v-if="enableModal" @close="close"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { ChannelModal } from '../modals'
import { NetworkRequest, ChannelRequest } from '../request'

export default defineComponent({
  components: {
    ChannelModal
  },
  async setup() {
    const enableModal = ref<Boolean>(false)

    function start() {
      enableModal.value = true
    }
    function close() {
      enableModal.value = false
    }


    return { 
      start,
      enableModal,
      close
    }
  }
})
</script>