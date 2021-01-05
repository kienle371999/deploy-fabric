const BlocktraceGateway = require('../BlocktraceGateway')

async function test() {
    try {
        const { contract } = await BlocktraceGateway.getInstance().networkConnection('identity')
        const identities = await contract.evaluateTransaction('queryAllIdentities')
        console.log(`Transaction has been evaluated, result is: ${identities}`)

        return JSON.parse(identities)
    }
    catch(error) {
        console.log('error ====>', error)
        return error
    }
}

test()