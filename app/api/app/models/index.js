const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.network = require("./network.model");
db.log = require("./log.model");

db.ROLES = ["admin"];

module.exports = {
    db: db
};