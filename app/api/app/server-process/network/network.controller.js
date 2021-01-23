const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { addNetwork, getNetwork, updateNetwork, deleteNetwork } = require('./network.service')

const api = express.Router()

api.get('/network/:networkArg', authJwt, async(req, res) => {
  try {
    const { networkArg } = req.params
    const result = await getNetwork({ networkArg, ...req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/network', authJwt, async(req, res) => {
  try {
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
    const result = await updateNetwork({ networkArg, ...req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.delete('/network/:networkArg', async(req, res) => {
  try {
    const { networkArg } = req.params
    const result = await deleteNetwork({ networkArg, ...req.body })
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

module.exports = api

