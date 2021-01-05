const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const HashInteraction = require('./storeHash/HashInteraction')

// function splitErrorMessage(error) {
//     return error.split('\n    ')
// }

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const port = process.env.API_PORT

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.listen(port, function () {
    console.log(`Server is listened on port ${port}`)
})


app.route('/api/data-hash')
    .get(async (req, res) => {
        const result = await HashInteraction.getInstance().queryAllHash()
        return res.status(result.code).json(result.data)
    })

app.route('/api/data-hash/query-with-params')
    .get([
        check('hashType').isString(),
        check('hashAttribute').isString()
    ], async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array() })
        }

        const data = req.body
        const result = await HashInteraction.getInstance().queryHashWithParams(data)
        return res.status(result.code).send(result.data)
    })    

app.route('/api/data-hash/:id')
    .get(async (req, res) => {
        const id = req.params.id
        const result = await HashInteraction.getInstance().queryHash(id)
        return res.setMaxListeners(result.code).json(result.data)
    })
    .post([
        check('dataId').isString(),
        check('dataHash').isMD5(),
        check('dataStatus').isString(),
        check('dataType').isString()
    ], async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array() })
        }

        const id = req.params.id
        const data = req.body
        const result = await HashInteraction.getInstance().createBlockHash(id, data)
        return res.status(result.code).json(result.data)
    })
    .put([
        check('dataHash').isMD5()
    ], async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array() })
        }

        const id = req.params.id
        const dataHash = req.body.dataHash
        const result = await HashInteraction.getInstance().updateDataHash(id, dataHash)
        return res.status(result.code).json(result.data)
    })

module.exports = app
