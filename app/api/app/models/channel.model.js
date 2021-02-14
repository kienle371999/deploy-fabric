const mongoose = require("mongoose")
const { Schema } = mongoose

const ChannelSchema = new Schema({
  name: {
    type: String,
    maxlength: 255,
    required: true
  },
  network: {
    type: Schema.Types.ObjectId,
    ref: 'Network'
  },
  organizations: [{
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }]
}, { timestamps: true })

const Channel = mongoose.model('Channel', ChannelSchema)
module.exports = Channel