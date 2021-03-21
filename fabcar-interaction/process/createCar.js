const { spawnSync } = require('child_process')
const messageHandle = require('../utils/messageHandle')
const createCar = (params) => {
  try {
    const res = spawnSync('bash', ['./cmd/create-fabcar.sh', params.car_number, params.car_manufacturer, params.car_model, params.car_color, params.car_owner])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
    }
    if(/Chaincode invoke successful/.test(res.stderr.toString())) {
      return messageHandle.success('Chaincode invoke successful')
    }
    return messageHandle.badRequest('Can not create Fabcar')
  }
  catch(error) {
    return messageHandle.badRequest(error.message)
  }
}

module.exports = {
  createCar
}