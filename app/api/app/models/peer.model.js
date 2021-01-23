const mongoose = require("mongoose")
const { Schema } = mongoose

const PeerSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    require: true
  },
  network: {
    type: Schema.Types.ObjectId,
    ref: 'Network',
    require: true
  },
  channel: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  name: {
    type: String,
    maxlength: 255,
    required: true
  },
  couchdb_name: {
    type: String,
    maxlength: 255
  },
  couchdb_username: {
    type: String,
    maxlength: 255
  },
  couchdb_password: {
    type: String,
    maxlength: 255
  },
  status: {
    type: String,
    maxlength: 255,
    required: true
  },
}, { timestamps: true })

const Peer = mongoose.model('Peer', PeerSchema)
module.exports = Peer