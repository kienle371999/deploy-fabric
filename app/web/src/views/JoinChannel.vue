<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="pb-6 pt-6 pl-12 pr-12 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Channel' }}</h3>
        <div class="align-middle mt-10 inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="table-fixed w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Network' }}</th>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                  <th class="px-6 py-3 w-1/3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Status' }}</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(element, index) in networkData" :key="index">
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <router-link
                      :class="[$route.name === 'NetworkElement' ? activeClass : inactiveClass]"
                      :to="'/network-setup/' + element._id">
                    <span class="hover:text-blue-700">{{ element.name }}</span>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <div v-for="(org, index) in element.organizations" :key="index">
                      <div class="py-2">{{ org.name }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <span>{{ element.status }}</span>
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
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import NetworkRequest from "../request/NetworkRequest"

export default defineComponent({
  async setup() {
    const networkData = await NetworkRequest.getNetwork()
    return { networkData }
  }
})
</script>