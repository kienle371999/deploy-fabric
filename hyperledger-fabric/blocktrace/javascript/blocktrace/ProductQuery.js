'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')

class ProductQuery {
    static getInstance() {
        return new ProductQuery
    }

    async queryProductByID(id) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('blocktrace')
        const product = await contract.evaluateTransaction('queryProduct', id)
        console.log(`Transaction has been evaluated, result is: ${product.toString()}`)

        return JSON.parse(product)
    }

    async queryAllProducts() {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('blocktrace')
        const products = await contract.evaluateTransaction('queryAllProducts')
        const convertedProducts = JSON.parse(products)
            
        return convertedProducts
    }
    async queryProductWithParam(data) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('blocktrace')
        const result = await contract.evaluateTransaction('queryProductWithParams', data.productType, data.productAttribute)

        return JSON.parse(result)
    }

    async queryProductWithPagination(data) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('blocktrace')
        const result = await contract.evaluateTransaction('queryProductWithPagination', data.pageSize, data.bookmark)

        return JSON.parse(result)
    }
}

module.exports = ProductQuery