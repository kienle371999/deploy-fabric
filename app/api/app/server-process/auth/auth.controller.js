const express = require('express')
const { signIn } = require('./auth.service')

const api = express.Router()

api.post('/signIn', async (req, res) => {
    const result = await signIn(req.body)
    return res.status(result.code).json(result.data)
})

module.exports = api