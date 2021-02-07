const mongoose = require("mongoose")
const { Schema } = mongoose

const ChaincodeSchema = new Schema({
  name: {
    type: String,
    maxlength: 255,
    required: true
  },
  status: {
    type: String,
    maxlength: 255,
    required: true
  },
  peers: [{
    type: Schema.Types.ObjectId,
    ref: 'Peer'
  }]
}, { timestamps: true })

const Chaincode = mongoose.model('Chaincode', ChaincodeSchema)
module.exports = Chaincode