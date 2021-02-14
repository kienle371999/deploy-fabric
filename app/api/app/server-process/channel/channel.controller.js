const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { createChannel } = require('./channel.service')

const api = express.Router()
api.post('/channel', authJwt, async(req, res) => {
  try {
    const result = await createChannel(req.body)
    return handleStatus(res, success(result))
  }
  catch(error) {
    return commonError(res, error)
  }
})

module.exports = api