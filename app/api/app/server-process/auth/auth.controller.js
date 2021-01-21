const express = require('express')
const { commonError, handleStatus } = require('../../library/response')
const { success } = require('../../utils/messageCode')
const { signIn, authenticateToken } = require('./auth.service')

const api = express.Router()

api.post('/signIn', async(req, res) => {
    try {
        const result = await signIn(req.body)
        return handleStatus(res, success(result))
    }
    catch(error) {
        return commonError(res, error)
    }
})

api.post('/authenticateToken', async(req, res) => {
    try {
        const result = await authenticateToken(req.body)
        return handleStatus(res, success(result))
    }
    catch(error) {
        return commonError(res, error)
    }
})

module.exports = api