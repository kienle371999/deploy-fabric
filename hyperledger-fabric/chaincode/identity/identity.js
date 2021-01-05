'use strict'

const { Contract } = require('fabric-contract-api')

class Identity extends Contract {
    async createIdentity(ctx, id, argument) {
        const parsedArgument = JSON.parse(argument)
        //check if identity existed
        const existedIdentity = await ctx.stub.getState(id)
        if (existedIdentity.length !== 0) {
            throw new Error(`${id} existed`)
        }

        if(parsedArgument.username.length <= 0) {
            throw new Error('UserName must be non-empty string')
        }
        if(parsedArgument.fullname.length <= 0) {
            throw new Error('FullName must be non-empty string')
        }
        if(parsedArgument.email.length <= 0) {
            throw new Error('Email must be non-empty string')
        }
        if(parsedArgument.publicKey.length <= 0) {
            throw new Error('PublicKey must be non-empty string')
        }

        const identity = {
            username: parsedArgument.username,
            fullname: parsedArgument.fullname,
            email: parsedArgument.email,
            publicKey: parsedArgument.publicKey
        }
       
        console.info('============= START : Create Identity ===========')
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(identity)))

        const event = {
            type: 'AddIdentityEvent',
            data: identity
        }

        await ctx.stub.setEvent('addIdentityEvent', Buffer.from(JSON.stringify(event)))
        console.info('============= END : Create Identity ===========')
    }

    async queryIdentity(ctx, id) {
        const identityAsBytes = await ctx.stub.getState(id)
        if (!identityAsBytes || identityAsBytes.length === 0) {
            throw new Error(`${id} does not exist`)
        }

        return identityAsBytes.toString()
    }

    async queryAllIdentities(ctx) {
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

    async updateIdentity(ctx, id, publicKey) {
        const identity = await this.queryIdentity(ctx, id)
        const updatedIdentity = JSON.parse(identity)
        updatedIdentity.publicKey = publicKey

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedIdentity)))

        const event = {
            type: 'UpdateIdentityEvent',
            data: updatedIdentity
        }

       await ctx.stub.setEvent('updateIdentityEvent', Buffer.from(JSON.stringify(event)))
   }

   async queryIdentityWithParams(ctx, identityType, identityAttribute) {
        if (identityType.length <= 0) {
            throw new Error('identityType must be non-empty string')
        }
        if (identityAttribute.length <= 0) {
            throw new Error('identityAttribute must be non-empty string')
        }
        const queryString = `{\"selector\":{\"${identityType}\":\"${identityAttribute}\"}}`
        const resultsIterator = await ctx.stub.getQueryResult(queryString)
        const res = await this.getAllResults(resultsIterator)
        console.log("queryIdentityWithParams -> res", res)

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

module.exports = Identity