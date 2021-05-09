const { spawnSync } = require('child_process')
const messageHandle = require('../utils/messageHandle')
const changeOwner = (params) => {
  try {
    const res = spawnSync('bash', ['./cmd/change-owner.sh', params.car_number, params.car_owner])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
    }
    if(/Chaincode invoke successful/.test(res.stderr.toString())) {
      return messageHandle.success('Chaincode update successful')
    }
    return messageHandle.badRequest('Can not change Fabcar Owner')
  }
  catch(error) {
    return messageHandle.badRequest(error.message)
  }
}

module.exports = {
  changeOwner
}