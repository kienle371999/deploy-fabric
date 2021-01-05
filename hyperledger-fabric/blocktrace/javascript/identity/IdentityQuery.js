'use strict'

const BlocktraceGateway = require('../BlocktraceGateway')

class IdentityQuery {
    static getInstance() {
        return new IdentityQuery
    }

    async queryIdentityByID(id) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
        const identity = await contract.evaluateTransaction('queryIdentity', id)
        console.log(`Transaction has been evaluated, result is: ${identity.toString()}`)

        return JSON.parse(identity)
    }

    async queryAllIdentities() {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
        const identities = await contract.evaluateTransaction('queryAllIdentities')
        const convertedIdentities = JSON.parse(identities)

        return convertedIdentities
    }
    async queryIdentitiesWithParam(data) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
        const result = await contract.evaluateTransaction('queryIdentityWithParams', data.identityType, data.identityAttribute)

        return JSON.parse(result)
    }

    async queryIdentitiesWithPagination(data) {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
        const result = await contract.evaluateTransaction('queryIdentityWithPagination', data.identityType, data.identityAttribute, data.pageSize, data.bookmark)

        return JSON.parse(result)
    }
}

module.exports = IdentityQuery