const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { getChaincode, createChaincode, startChaincode } = require('./chaincode.service')

const api = express.Router()
api.get('/chaincode', authJwt, async(req, res) => {
  try {
    const result = await getChaincode(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/chaincode', authJwt, async(req, res) => {
  try {
    const result = await createChaincode(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/chaincode/:id', authJwt, async(req, res) => {
  try {
    const { chaincodeId } = req.params
    const result = await startChaincode({ chaincodeId, ...req.body })
    return result
  }
  catch(error) {
    return commonError(res, error)
  }
})

module.exports = api