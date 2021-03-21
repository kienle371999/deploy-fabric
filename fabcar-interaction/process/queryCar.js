const { spawnSync } = require('child_process')
const messageHandle = require('../utils/messageHandle')
const queryCar = () => {
  try {
    const res = spawnSync('bash', ['./cmd/query-fabcar.sh'])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
    }
    return messageHandle.success(JSON.parse(res.stdout.toString()))
  }
  catch(error) {
    return messageHandle.badRequest(error.message)
  }
}

module.exports = {
  queryCar
}