'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')

class IdentityUpdate {
    static getInstance() {
        return new IdentityUpdate
    }

    async updateKey(id, newPublicKey) {
        const { gateway, contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
           
        await contract.submitTransaction('updateIdentity', id, newPublicKey)
        console.log('Transaction has been submitted')

        const transactionInfo = await BlocktraceGateway.getInstance().transactionListener(contract, 'updateIdentityEvent')
        gateway.disconnect()

        return transactionInfo
    }
}

module.exports = IdentityUpdate