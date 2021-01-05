'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')
const messageHandle = require('../utils/messageHandle')



class HashInteraction {
    static getInstance() {
        return new HashInteraction()
    }

    async createBlockHash(id, data) {
        try {
            const { contract, gateway } = await BlocktraceGateway.getInstance().networkConnection('blockhash')
            await contract.submitTransaction('createHash', id, JSON.stringify(data))
            const transactionInfo = await BlocktraceGateway.getInstance().transactionListener(contract, 'createdHashEvent')
            gateway.disconnect()
            console.log('Transaction has been submitted')
            return messageHandle.success(transactionInfo)
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }

    async queryHash(id) {
        try {
            const { contract } = await BlocktraceGateway.getInstance().networkConnection('blockhash')
            const hash = await contract.evaluateTransaction('queryHash', id)
            console.log(`Transaction has been evaluated, result is: ${hash.toString()}`)
            return messageHandle.success(JSON.parse(hash))
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }

    async queryAllHash() {
        try {
            const { contract } = await BlocktraceGateway.getInstance().networkConnection('blockhash')
            const allHash = await contract.evaluateTransaction('queryAllHash')
            return messageHandle.success(JSON.parse(allHash))
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }

    async queryHashWithParams(data) {
        try {
            const { contract } = await BlocktraceGateway.getInstance().networkConnection('blockhash')
            const result = await contract.evaluateTransaction('queryHashWithParams', data.hashType, data.hashAttribute)
            return messageHandle.success(JSON.parse(result))
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }

    async updateDataHash(id, dataHash) {
        try {
            const { contract, gateway } = await BlocktraceGateway.getInstance().networkConnection('blockhash')
            await contract.submitTransaction('updateHash', id, dataHash)
            const transactionInfo = await BlocktraceGateway.getInstance().transactionListener(contract, 'updatedHashEvent')
            gateway.disconnect()
            console.log('Transaction has been submitted')
            return messageHandle.success(transactionInfo)
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }
}

module.exports = HashInteraction