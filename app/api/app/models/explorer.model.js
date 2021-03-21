const mongoose = require("mongoose")
const { Schema } = mongoose

const ExplorerSchema = new Schema({
  network: {
    type: Schema.Types.ObjectId,
    ref: 'Network',
    require: true
  },
  name: {
    type: String,
    maxlength: 255,
    required: true
  },
  port: {
    type: String,
    maxlength: 255,
    required: true
  }
}, { timestamps: true })

const Explorer = mongoose.model('Explorer', ExplorerSchema)
module.exports = Explorer