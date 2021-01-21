const mongoose = require("mongoose")
const { Schema } = mongoose

const NetworkSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
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

const Network = mongoose.model('Network', NetworkSchema)
module.exports = Network