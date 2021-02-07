const mongoose = require("mongoose")
const { Schema } = mongoose

const ChannelSchema = new Schema({
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

const Channel = mongoose.model('Channel', ChannelSchema)
module.exports = Channel