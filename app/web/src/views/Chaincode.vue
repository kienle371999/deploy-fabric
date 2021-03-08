<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h3 class="text-gray-700 text-3xl font-medium text-center">{{ 'Chaincode' }}</h3>
        <div class="mt-8">
            <div class="grid grid-cols-2 gap-6">
              <div class="border-2 border-gray-500 p-8">
                <div>
                  <label class="text-gray-700" for="chaincode_name">{{ 'Chaincode Name' }}</label>
                  <input 
                    class="form-input w-full mt-2 rounded-md" 
                    :class="[chaincodeError.name.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                    type="text" 
                    v-model="chaincode.name"/>
                  <div v-if="chaincodeError.name.status">
                    <div class="mt-2 text-red-700">{{ chaincodeError.name.message }}</div>
                  </div>
                </div>
                <div class="pt-8">
                  <label class="text-gray-700" for="chaincode_name">{{ 'Channel Name' }}</label>
                  <!-- <input 
                    class="form-input w-full mt-2 rounded-md" 
                    :class="[chaincodeError.channel.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                    type="text" 
                    v-model="chaincode.channel"/>
                  <div v-if="chaincodeError.channel.status">
                    <div class="mt-2 text-red-700">{{ chaincodeError.channel.message }}</div>
                  </div> -->
                  <multi-select class="mt-2 border-red-600 focus:border-indigo-600"
                    v-model="chaincode.channel"
                    mode="single"
                    :allow-empty="true"
                    placeholder="Select"
                    :options="channelOptions"/>
                </div>
                <div class="pt-8">
                  <label class="text-gray-700" for="chaincode_name">{{ 'Chaincode Path' }}</label>
                  <input 
                    class="form-input w-full mt-2 rounded-md" 
                    :class="[chaincodeError.path.status ? 'focus:border-red-600 border-red-600': 'focus:border-indigo-600']" 
                    type="text" 
                    v-model="chaincode.path"/>
                  <div v-if="chaincodeError.path.status">
                    <div class="mt-2 text-red-700">{{ chaincodeError.path.message }}</div>
                  </div>
                </div>
                <div class="flex justify-center mt-8">
                  <button 
                  class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  @click="submit()">{{ 'Submit' }}</button>
                </div>
              </div>
             <div class="align-middle inline-block w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table class="table-fixed w-full">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-center font-semibold text-gray-600 uppercase tracking-wider">{{ 'Chaincode Name' }}</th>
                      <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-center font-semibold text-gray-600 uppercase tracking-wider">{{ 'Chaincode Channel' }}</th>
                      <th class="px-6 py-3 w-1/6 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-center font-semibold text-gray-600 uppercase tracking-wider">{{ 'Action' }}</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    <tr v-for="(chaincode, index) in chaincodeTableData" :key="index">
                      <td class="px-6 py-5 border-b border-gray-200 text-center bg-white text-sm">
                          <span>{{ chaincode.name }}</span>
                      </td>
                      <td class="px-6 py-5 border-b border-gray-200 text-center bg-white text-sm">
                        <span>{{ chaincode.channel.name }}</span>
                      </td>
                      <td 
                      class="px-6 py-5 border-b border-gray-200 text-center bg-white text-sm"
                      v-if="chaincode.status === 'New'">
                        <button 
                          class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                          @click="instantiate()"
                        >{{ 'Instantiate' }}</button>
                      </td>
                      <td
                      class="px-6 py-5 border-b border-gray-200 text-center bg-white text-sm"
                      v-else>
                        <button 
                          class="px-4 py-2 bg-gray-500 text-gray-200 rounded-md"
                          :disabled="true"
                        >{{ 'Instantiated' }}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue"
import { validateForm } from '../utils/commonLib'
import { useNetworkData } from "../hooks/useNetworkData"
import { chaincodes } from '../hooks/useChaincodeData'
import { IChaincode } from '../hooks/useInterface'
import ChaincodeRequest from '../request/ChaincodeRequest'

interface ChaincodeError {
  name: {
    status: boolean
    message: string
  }
  channel: {
    status: boolean
    message: string
  }
  path: {
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
    const { vChannels, vChaincodes } = await chaincodes()
    if(validateData({ vChaincodes })) {
      return {
        status: true,
        data: { vChannels, vChaincodes }
       }
    }
    return {
      status: false,
      data: { vChannels }
    }
  }
  catch(error) {
    return
  }
}

const crawledChaincode = async(crawledData: any) => {
  if(crawledData.status) {
      return crawledData.data.vChaincodes.map(data => {
        return {
          name: data.name,
          channel: data.channel,
          status: data.status
        }
      })
    }

} 

export default defineComponent({
  async setup() {
    const startWatch = ref<Boolean>(false)
    const channelOptions = ref<String[]>([])
    const chaincode = ref<IChaincode>({
      name: '',
      channel: '',
      path: ''
    })
    const chaincodeTableData = ref<IChaincode[]>([])
    const chaincodeError = ref<ChaincodeError>({
      name: {
        status: false,
        message: ''
      },
      channel: {
        status: false,
        message: ''
      },
      path: {
        status: false,
        message: ''
      }
    })

    const crawledData = await crawlData()
    channelOptions.value = crawledData.data.vChannels.map(channel => {
      return {
        value: channel.name,
        label: channel.name
      }
    })

    chaincodeTableData.value = await crawledChaincode(crawledData)
    
    function handleForm() {
      startWatch.value = true
      chaincodeError.value.name = validateForm('Chaincode', chaincode.value.name)
      chaincodeError.value.channel = validateForm('Channel Name', chaincode.value.channel)
      chaincodeError.value.path = validateForm('Chaincode Path', chaincode.value.path)
    }

    function checkState() {
      let state: boolean = true
      if(chaincodeError.value.name.status) state = false
      if(chaincodeError.value.channel.status) state = false
      if(chaincodeError.value.path.status) state = false
      return state
    }

    watchEffect(() => {
      if(startWatch.value) {
        handleForm()
      }
    })

    async function submit() {
      handleForm()
      if(checkState()) {
        try {
          const res = await ChaincodeRequest.creatChaincode(chaincode.value)
          if(res) {
            chaincode.value = {
              name: '',
              channel: '',
              path: ''
            }
            startWatch.value = false
            const crawledData = await crawlData()
            chaincodeTableData.value = await crawledChaincode(crawledData)
            this.$toast.success('Successfully add chaincode')
          }
        }
        catch(error) {
          this.$toast.error(error.message)
        }
      }
    }


    return { 
      chaincode,
      chaincodeError,
      chaincodeTableData,
      channelOptions,
      submit
    }
  }
})
</script>
