const mongoose = require("mongoose")
const { Schema } = mongoose

const OrgaizationSchema = new Schema({
    network: {
        type: Schema.Types.ObjectId,
        ref: 'Network',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    role: {
        type: String,
        required: true,
        maxlength: 255
    },
    ca_username: {
        type: String,
        lowercase: true,
        maxlength: 255
    },
    ca_password: {
        type: String,
        maxlength: 255
    },
    ca_port: {
        type: String,
        maxlength: 255
    }
}, { timestamps: true })

const Organization = mongoose.model('Organization', OrgaizationSchema)
module.exports = Organization