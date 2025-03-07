const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    mob_no: {
      type: String,
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test(v),
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    pinCode: {
      type: String,
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: (props) => `${props.value} is not a valid pin code!`,
      },
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// Adds username, hash, and salt fields, along with helper authentication methods
schema.plugin(passportLocalMongoose, { usernameField: "email" });


const User = mongoose.model("User", schema);
module.exports = User;
