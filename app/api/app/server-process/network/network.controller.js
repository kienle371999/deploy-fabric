const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { addNetwork, getNetwork, updateNetwork, deleteNetwork, startNetwork, getNetworkById } = require('./network.service')

const api = express.Router()
api.get('/network', authJwt, async(req, res) => {
  try {
    const result = await getNetwork(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})
api.get('/network/:networkId/:networkArg', authJwt, async(req, res) => {
  try {
    const { networkId, networkArg } = req.params
    const result = await getNetworkById({ networkId, networkArg, ...req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/network', authJwt, async(req, res) => {
  try {
    console.log('12233')
    const result = await addNetwork(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.put('/network/:networkArg', async(req, res) => {
  try {
    const { networkArg } = req.params
    const result = await updateNetwork({ networkArg, networkData: req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.delete('/network/:networkArg', async(req, res) => {
  try {
    const { networkArg } = req.params
    const result = await deleteNetwork({ networkArg, networkData: req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/start-network/:networkId', async(req, res) => {
  try {
    const { networkId } = req.params
    const result = await startNetwork({ networkId })
    return handleStatus(res, success(result))
  }
  catch(error) {
    console.log("error", error)
    return commonError(res, error)
  }
})

module.exports = api

