const User = require("./user.model")
const Network = require("./network.model")
const Organization = require("./organization.model")
const Peer = require("./peer.model")
const Channel = require("./channel.model")
const Chaincode = require("./chaincode.model")
const Explorer = require('./explorer.model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = {
  mongoose,
  User,
  Network,
  Organization,
  Peer,
  Channel,
  Chaincode,
  Explorer
}