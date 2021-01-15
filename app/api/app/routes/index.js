const api = require('express').Router()
const Glob = require('glob')

const apis = Glob.sync('**/*.controller.js') 
apis.forEach((subApi) => api.use(require('../' + subApi)))

module.exports = api
