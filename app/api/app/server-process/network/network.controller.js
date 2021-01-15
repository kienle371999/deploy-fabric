const express = require('express')
const authJwt = require('../../middlewares/authJwt')
const { addNetwork } = require('./network.service')

const api = express.Router()

api.post('/network', authJwt, async (req, res) => {
    const result = await addNetwork(req.body)
    return res.status(result.status).json(result.data)
})

module.exports = api

