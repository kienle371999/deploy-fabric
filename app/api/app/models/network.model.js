const mongoose = require("mongoose");

const Network = mongoose.model(
  "Network",
  new mongoose.Schema({
    name: String,
    status: String,
    orgs: [{}]
  })
);

module.exports = Network;