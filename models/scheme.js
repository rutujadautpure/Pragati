const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  schemeType: { type: String, enum: ["Central", "State", "Finance"], required: true },
  website: { type: String, required: false },
});

module.exports = mongoose.model("Scheme", SchemeSchema);
