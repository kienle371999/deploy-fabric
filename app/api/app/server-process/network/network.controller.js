const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { addNetwork, getNetwork, updateNetwork, deleteNetwork, startNetwork, getNetworkByArg } = require('./network.service')
const { defaultNetwork } = require('../../utils/constant')

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
api.get('/network/:networkArg', authJwt, async(req, res) => {
  try {
    const { networkArg } = req.params
    const result = await getNetworkByArg({ networkArg, ...req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/network', authJwt, async(req, res) => {
  try {
    const network_name = defaultNetwork
    const result = await addNetwork({ network_name, ...req.body })
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

api.post('/start-network', async(req, res) => {
  try {
    const result = await startNetwork()
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

module.exports = api

