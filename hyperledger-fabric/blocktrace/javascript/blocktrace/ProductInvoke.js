'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')


class ProductInvoke {
    static getInstance() {
        return new ProductInvoke()
    }

    async createProduct(id, data) {
        const { gateway, contract } = await BlocktraceGateway.getInstance().networkConnection('blocktrace')
            
        // Submit the specified transaction.
        console.log('=====', data)
        await contract.submitTransaction('createProduct', id, JSON.stringify(data))
        console.log('Transaction has been submitted')

        const transactionInfo = await BlocktraceGateway.getInstance().transactionListener(contract, 'addProductEvent')
        gateway.disconnect()

        return transactionInfo
    }
}

module.exports = ProductInvoke