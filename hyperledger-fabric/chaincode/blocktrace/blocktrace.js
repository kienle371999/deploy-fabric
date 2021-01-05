'use strict'

const { Contract } = require('fabric-contract-api')

class BlockTrace extends Contract {
    async createProduct(ctx, id, argument) {
        //check if product existed
        const parsedArgument = JSON.parse(argument)
        const existedProduct = await ctx.stub.getState(id)
        if (existedProduct.length != 0) {
            throw new Error(`${id} existed`)
        }

        if(parsedArgument.name.length <= 0) {
            throw new Error('name must be non-empty string')
        }
        if(parsedArgument.duration.length <= 0) {
            throw new Error('duration must be non-empty string')
        }

        const product = {
            name: parsedArgument.name,
            duration: parsedArgument.duration
        }
    
        //start creating new product
        console.info('============= START : Create Product ===========')
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)))

        const event = {
            type: 'AddProductEvent',
            data: product
        }

        await ctx.stub.setEvent('addProductEvent', Buffer.from(JSON.stringify(event)))
        console.info('============= END : Create Product ===========')
    }

    async queryProduct(ctx, id) {
        const productAsBytes = await ctx.stub.getState(id)
        if (!productAsBytes || productAsBytes.length == 0) {
            throw new Error(`${id} does not exist`)
        }

        return productAsBytes.toString()
    }

    async queryAllProducts(ctx) {
        const startKey = ''
        const endKey = ''
        const allResults = []
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8')
            let record;
            try {
                record = JSON.parse(strValue)
            } catch (err) {
                console.log(err)
                record = strValue
            }

            allResults.push({ key: key, record: record })
        }
        
        return allResults
    }

    async queryProductWithPagination(ctx, pageSize, bookmark) {
        const startKey = ''
        const endKey = ''
        
        const { iterator, metadata } = await ctx.stub.getStateByRangeWithPagination(startKey, endKey, pageSize, bookmark)
        const res = await this.getAllResults(iterator)

        res.ResponseMetadata = {
            RecordsCount: metadata.fetched_records_count,
            Bookmark: metadata.bookmark,
        }

        return res
    }


    async queryProductWithParams(ctx, productType, productAttribute) {
        if (productType.length <= 0) {
            throw new Error('productType must be non-empty string')
        }
        if (productAttribute.length <= 0) {
            throw new Error('productAttribute must be non-empty string')
        }
        const queryString = `{\"selector\":{\"${productType}\":\"${productAttribute}\"}}`
        const resultsIterator = await ctx.stub.getQueryResult(queryString)
        const res = await this.getAllResults(resultsIterator)
        console.log("queryProductWithParams -> res", res)

        return res
    }

    async getAllResults(iterator) {
        let allResults = []
        while (true) {
            let res = await iterator.next()
        
            if (res.value && res.value.value.toString()) {
                let jsonRes = {}
                console.log(res.value.value.toString('utf8'))
                jsonRes.Key = res.value.key
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'))
                } catch (err) {
                    console.log(err)
                    jsonRes.Record = res.value.value.toString('utf8')
                }

                allResults.push(jsonRes)
            }
            if (res.done) {
                console.log('end of data')
                await iterator.close()
                console.info(allResults)
                return allResults
            }
        }
    }
}

module.exports = BlockTrace