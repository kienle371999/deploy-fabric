<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Explorer Setup' }}</h3>
        <div class="pl-8 pt-8 w-3/5">
          <label class="text-gray-700" for="org_name">{{ 'Explorer Name' }}</label>
          <input 
            class="form-input w-full mt-2 rounded-md bg-gray-500"  
            type="text" 
            :disabled="true"
            v-model="explorer.name"/>
        </div>
        <div class="pl-8 pt-8 w-3/5">
          <label class="text-gray-700" for="number_peers">{{ 'Explorer Port' }}</label>
          <input 
            class="form-input w-full mt-2 rounded-md" 
            :class="[explorerError.port.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
            type="text" 
            :disabled="configState"
            v-model="explorer.port"/>
          <div v-if="explorerError.port.status">
            <div class="mt-2 text-red-700">{{ explorerError.port.message }}</div>
          </div>
        </div>
        <div class="pt-8 pb-6 w-3/5 flex justify-center">
          <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            @click="create()">{{ 'Create Explorer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue"
import { validateForm } from '../utils/commonLib'
import ExplorerRequest from '../request/ExplorerRequest'

interface Explorer {
  name: string
  port: string
}

interface ExplorerError {
  port: {
    status: boolean
    message: string
  }
}

const crawlData = async() => {
  try {
    const vExplorer = await ExplorerRequest.getExplorer()
    return vExplorer
  }
  catch(error) {
    return 
  }
}

export default defineComponent({
  async setup() {
    const startWatch = ref<Boolean>(false)
    const configState = ref<boolean>(false)
    const explorer = ref<Explorer>({ name: 'Blocktrace Explorer', port: '' })
    const explorerError = ref<ExplorerError>({
      port: {
        status: false,
        message: ''
      }
    })

    const crawledData = await crawlData()
    if(crawledData) {
      explorer.value = { name: crawledData.name, port: crawledData.port }
      configState.value = true
    }

    function handleForm() {
      startWatch.value = true
      explorerError.value.port = validateForm('Explorer Port', explorer.value.port)
    }

    function checkState() {
      let state: boolean = true
      if(explorerError.value.port) state = false
      return state
    }

    watchEffect(() => {
      if(startWatch.value) {
        handleForm()
      }
    })

    async function create() {
      handleForm()
      if(checkState()) {
        try {
          const loader = this.$loading()
          loader.show({ loader: 'dots' })
          const res = await ExplorerRequest.createExplorer({ name: explorer.value.name, port: explorer.value.port })
          if(res) {
            loader.hide()
            this.$toast.success('Successfully create explorer')
          }
        }
        catch(error) {
          this.$toast.error(error.message)
          return
        }
      }
    }

    return { explorer, explorerError, configState, create }
  }
})
</script>
