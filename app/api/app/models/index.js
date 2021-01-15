require("./user.model")
require("./network.model")
require("./log.model")
require("./organization.model")
require("./peer.model")
require("./channel.model");
require("./chaincode.model");
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = mongoose