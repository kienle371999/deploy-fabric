<template>
   <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Network Configuration'}}</h3>
          <form @submit.prevent="register">
            <div class="pt-8 pl-8 w-2/5">
              <label class="text-gray-700" for="org_name">{{ 'Network Name'}}</label>
              <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text" v-model="network_name"/>
            </div>
            <div class="m-8 border-2 border-gray-500">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/5 pt-8 pl-8"
              v-for="(org, index) in organizations" :key="index">
                <div>
                  <label class="text-gray-700" for="org_name">{{ 'Organization Name'}}</label>
                  <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text" v-model="organizations[index].org_name"/>
                </div>
                <div>
                  <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                  <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="email" v-model="organizations[index].number_peers"/>
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
                  <label class="text-gray-700" for="org_name">{{ 'Order Name'}}</label>
                  <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text" v-model="order.order_name"/>
                </div>
                <div>
                  <label class="text-gray-700" for="number_peers">{{ 'Peers' }}</label>
                  <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="email" v-model="order.number_peers"/>
                </div>
              </div>
            </div>
          </form>
            <div class="flex justify-center mt-4 pb-6">
              <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              @click="save()">{{ 'Save Configuration'}}</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface Organization {
  org_name: String,
  number_peers: String
}

interface Order {
  order_name: String,
  number_peers: String
}

export default defineComponent({
  setup() {
    const organizations = ref<[Organization]>([{ 
      org_name: "",
      number_peers: ""
    }])
    const order = ref<Order>({
      order_name: '',
      number_peers: '1'
    })
    const network_name = ref<String>()

    return { organizations, order, network_name }
  },
  methods: {
    addOrg() {
      this.organizations.push({
        org_name: "",
        number_peers: ""
      })
    },
    save() {

    }
  }
});
</script>