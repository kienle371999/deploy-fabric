const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const authJwt = require('../../middlewares/authJwt')
const { success } = require('../../utils/messageCode')
const { addNetwork, getNetwork, updateNetwork } = require('./network.service')

const api = express.Router()

api.get('/network', async(req, res) => {
    try {
        const result = await getNetwork(req.body)
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

api.put('/network', async(req, res) => {
    try {
        const result = await updateNetwork(req.body)
        return handleStatus(res, success(result))
    }
    catch(error) {
        return commonError(res, error)
    }
})

module.exports = api

