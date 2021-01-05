'use strict'

const FabricCAServices = require('fabric-ca-client')
const { Gateway, Wallets } = require('fabric-network')
const messageHandle = require('./utils/messageHandle')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: require('find-config')('.env') })

class BlocktraceGateway {
    static getInstance() {
        return new BlocktraceGateway
    }

    async walletConnection() {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'blocktrace-network', 'organizations', 'peerOrganizations', 'org1.blocktrace.com', 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.blocktrace.com']
        const caTLSCACerts = caInfo.tlsCACerts.pem
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

        // Create a new file system based wallet for managing identities.
        const walletPath = process.env.WALLET_PATH
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        return { ca, ccp, wallet }
    }

    async networkConnection(contractName) {
        // Check to see if we've already enrolled the user.
        const { ccp, wallet } = await this.walletConnection()
        const identity = wallet.get('admin')
        if (!identity) {
            console.log('An identity for the user "admin" does not exist in the wallet')
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } })
        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL)

        // Get the contract from the network.
        const contract = network.getContract(contractName)        
        return { gateway, contract }
    }

    async transactionListener(contract, eventName) {
        try {
            let transactionInfo
            const listener = async (event) => {
                if (event.eventName === eventName) {
                    const transactionEvent = event.getTransactionEvent()
                    const blockEvent = transactionEvent.getBlockEvent()
                    console.log('************************ Start Event **********************************')
                    console.log(`Block Number: ${blockEvent.blockNumber} Transaction ID: ${transactionEvent.transactionId} Status: ${transactionEvent.status}`)
                    console.log('************************ End Event ************************************')
                    transactionInfo = {
                        block_number: blockEvent.blockNumber.low,
                        transaction_hash: transactionEvent.transactionId,
                        status: transactionEvent.status
                    }
                }
            }
            await contract.addContractListener(listener)
            return transactionInfo
        }
        catch(error) {
            return messageHandle.serverError(error.message)
        }
    }
}

module.exports = BlocktraceGateway
