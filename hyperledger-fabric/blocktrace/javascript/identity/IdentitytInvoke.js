'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')


class IdentityInvoke {
    static getInstance() {
        return new IdentityInvoke()
    }

    async createIdentity(id, data) {
        console.log("IdentityInvoke -> createIdentity -> data", data)
        const { gateway, contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
            
        // Submit the specified transaction.
        await contract.submitTransaction('createIdentity', id, JSON.stringify(data))
        console.log('Transaction has been submitted')

        const transactionInfo = await BlocktraceGateway.getInstance().transactionListener(contract, 'addIdentityEvent')
        gateway.disconnect()

        return transactionInfo
    }
}

module.exports = IdentityInvoke