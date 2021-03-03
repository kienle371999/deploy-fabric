const mongoose = require("mongoose")
const { Schema } = mongoose

const ChaincodeSchema = new Schema({
  name: {
    type: String,
    maxlength: 255,
    required: true
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  network: {
    type: Schema.Types.ObjectId,
    ref: 'Network'
  },
  path: {
    type: String,
    maxlength: 255,
    required: true
  },
  status: {
    type: String,
    maxlength: 255,
    required: true
  }
}, { timestamps: true })

const Chaincode = mongoose.model('Chaincode', ChaincodeSchema)
module.exports = Chaincode