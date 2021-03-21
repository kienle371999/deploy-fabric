const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { getExplorer, createExplorer } = require('./explorer.service')

const api = express.Router()
api.get('/explorer', authJwt, async(req, res) => {
  try {
    const result = await getExplorer()
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

api.post('/explorer', authJwt, async(req, res) => {
  try {
    const result = await createExplorer(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

module.exports = api