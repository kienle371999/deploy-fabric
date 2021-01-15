const mongoose = require("mongoose")
const { Schema } = mongoose

const PeerSchema = new Schema({
  org_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    require: true
  },
  channel_id: [{
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
    maxlength: 255,
    required: true
  },
  couchdb_username: {
    type: String,
    maxlength: 255,
    required: true
  },
  couchdb_password: {
    type: String,
    maxlength: 255,
    required: true
  },
  status: {
    type: String,
    maxlength: 255,
    required: true
  },
}, { timestamps: true })

const Peer = mongoose.model('Peer', PeerSchema)
module.exports = Peer