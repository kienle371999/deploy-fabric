'use strict'

const { Contract } = require('fabric-contract-api')

class BlockHash extends Contract {
    async createHash(ctx, id, args) {
        const parsedArgs = JSON.parse(args)
        if(!this._validObj(await ctx.stub.getState(id))) throw new Error(`Data of ${id} at ${parsedArgs.dataType} is inited`)

        if(!this._validArgs(parsedArgs.dataId)) throw new Error('Data ID must be non-empty')
        if(!this._validArgs(parsedArgs.dataHash)) throw new Error('Data Hash must be non-empty')
        if(!this._validArgs(parsedArgs.dataStatus)) throw new Error('Data Status must be non-empty')
        if(!this._validArgs(parsedArgs.dataType)) throw new Error('Data Type must be non-empty')
        if(!this._validObj(await this.queryBuilder(ctx, 'dataHash', parsedArgs.dataHash))) throw new Error('Duplicate Data Hash')

        const existedData = await this.queryBuilder(ctx, 'dataId', parsedArgs.dataId)
        if(!this._validObj(existedData)) {
            if(existedData[0].Record.dataStatus === parsedArgs.dataStatus) throw new Error('Invalidly create data')
        }

        try {
            const dataHashEvent = {
                type: 'createdHashEvent',
                data: parsedArgs
            }
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(parsedArgs)))
            await ctx.stub.setEvent('createdHashEvent', Buffer.from(JSON.stringify(dataHashEvent)))
        }
        catch(error) {
            throw new Error(error.message)
        }
        return parsedArgs
    }

    async queryHash(ctx, id) {
        const queriedHash = await ctx.stub.getState(id)
        if(typeof queriedHash !== 'object' || queriedHash.length === 0) throw new Error(`Don't exist data`)
        return queriedHash.toString()
    }

    async queryAllHash(ctx) {
        const startKey = ''
        const endKey = ''
        const allDataHashs = []
        try {
            for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
                const strValue = Buffer.from(value).toString('utf8')
                let record
                try {
                    record = JSON.parse(strValue)
                } 
                catch (err) {
                    console.log(err)
                    record = strValue
                }
                allDataHashs.push({ key: key, record: record })
            }
            return allDataHashs
        }
        catch(error) {
            throw new Error(error.message)
        }
    }

    async queryHashWithParams(ctx, hashType, hashAttribute) {
        if (!this._validArgs(hashType)) throw new Error('hashType must be non-empty')
        if (!this._validArgs(hashAttribute)) throw new Error('hashAttribute must be non-empty string')
        return this.queryBuilder(ctx, hashType, hashAttribute)
    }

    async updateHash(ctx, id, dataHash) {
        const existDataHash = await ctx.stub.getState(id)
        if(this._validObj(existDataHash)) throw new Error(`Data of ${id} don't exist`)
        if(!this._validObj(await this.queryBuilder(ctx, 'dataHash', dataHash))) throw new Error('Invalidly update Data Hash')
        if(!this._validArgs(dataHash)) throw new Error('Data Hash must be non-empty')

        const data = JSON.parse(existDataHash.toString())
        data.dataHash = dataHash
        try {
            const dataHashEvent = {
                type: 'updatedHashEvent',
                data: data
            }
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)))
            await ctx.stub.setEvent('updatedHashEvent', Buffer.from(JSON.stringify(dataHashEvent)))
        }
        catch(error) {
            throw new Error(error.message)
        }
        return data
    }

    _validArgs(arg) {
        if(typeof arg !== 'string' || arg.length === 0) return false
        return true
    }

    _validObj(args) {
        if(typeof args === 'object' && args.length !== 0) return false
        return true
    } 

    async queryBuilder(ctx, hashType, hashAttribute) {
        try {
            const queryString = `{\"selector\":{\"${hashType}\":\"${hashAttribute}\"}}`
            const resultsIterator = await ctx.stub.getQueryResult(queryString)
            const res = await this.getAllResults(resultsIterator)
            return res
        }
        catch(error) {
            throw new Error(error.message)
        }
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

module.exports = BlockHash