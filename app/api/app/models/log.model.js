const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema(
    {
      networkId: String,
      message: String,
    },
    { timestamps: { } }
  )
);

module.exports = Log;
