const mongoose = require("mongoose")
const { Schema } = mongoose

const LogSchema = new Schema({
  networkId: {
    type: String,
    maxlength: 255,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true })

const Log = mongoose.model('Log', LogSchema)
module.exports = Log
