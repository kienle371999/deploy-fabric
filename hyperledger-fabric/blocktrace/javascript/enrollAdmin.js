'use strict'

const BlocktraceGateway = require('./BlocktraceGateway')

async function main() {
    try {
        const { ca, wallet } = await BlocktraceGateway.getInstance().walletConnection()

        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' })
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        }
        await wallet.put('admin', x509Identity)
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet')

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`)
        process.exit(1)
    }
}

main()
