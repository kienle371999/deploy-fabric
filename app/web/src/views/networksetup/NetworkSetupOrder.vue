<template>
 <div class="mt-8">
    <div class="mt-4">
      <div class="pb-6 pt-6 pl-12 pr-12 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Network Configuration' }}</h3>
        <div class="flex flex-col mt-6">
          <div class="grid grid-cols-3 mb-8 w-3/5">
            <router-link class="duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[$route.name === 'NetworkSetupOrg' ? activeClass : inactiveClass]"
            to="/network-setup/organization">
            <span class="mx-auto">{{ 'Organization' }}</span>
          </router-link>
          <router-link class="duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[$route.name === 'NetworkSetupPeer' ? activeClass : inactiveClass]"
            to="/network-setup/peer">
            <span class="mx-auto">{{ 'Peer' }}</span>
          </router-link>
          <router-link class="duration-200 mt-4 py-2 px-6 border-b-4" 
            :class="[$route.name === 'NetworkSetupOrder' ? activeClass : inactiveClass]"
            to="/network-setup/order">
            <span class="mx-auto">{{ 'Order' }}</span>
          </router-link>
        </div>
          <div class="py-4 overflow-x-auto">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Peer' }}</th>
                    <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ 'Organization' }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white">
                  <tr v-for="(element, index) in orderTableData" :key="index">
                    <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <div class="flex items-center">
                        <span><input v-model="element.peer"/></span>
                      </div>
                    </td>
                    <td class="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <span><input v-model="element.order"/></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import NetworkRequest from "../../request/NetworkRequest"
import { orderTableData } from "../../hooks/useTableData"
export default defineComponent({
  setup() {
    const activeClass = ref(
      "border-gray-900"
    );
    const inactiveClass = ref(
      ""
    )
    return { 
      orderTableData,
      activeClass,
      inactiveClass
    }
  }
});
</script>