const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const { queryCar } = require('./process/queryCar')
const { createCar } = require('./process/createCar')
const { changeOwner } = require('./process/changeOwner')

require('dotenv').config({ path: require('find-config')('.env') })
const app = express()
const port = process.env.API_PORT || 7500

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.listen(port, function () {
    console.log(`Server is listened on port ${port}`)
})

app.get('/api/query-car', async (req, res) => {
  const result = queryCar()
  return res.status(result.code).json(result)
})  
app.post('/api/create-car', [
  check('car_number').isString(),
  check('car_manufacturer').isString(),
  check('car_model').isString(),
  check('car_color').isString(),
  check('car_owner').isString()
], async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0])
  }
  const result = createCar(req.body)
  return res.status(result.code).json(result)
})  
app.post('/api/change-owner', [
  check('car_number').isString(),
  check('car_owner').isString()
], async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0])
  }
  const result = changeOwner(req.body)
  return res.status(result.code).json(result)
})  
