const mongoose = require("mongoose");

const teyitci = mongoose.Schema({
  _id: String,
  kayıtliste2: Number
});

module.exports = mongoose.model("teyitci", teyitci);