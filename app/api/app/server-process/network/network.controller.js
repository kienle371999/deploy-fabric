const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { addNetwork } = require('./network.service')

const api = express.Router()

api.post('/network', authJwt, async(req, res) => {
    try {
        const result = await addNetwork(req.body)
        return handleStatus(res, success(result))
    }
    catch(error) {
        return commonError(res, error)
    }
})

module.exports = api

