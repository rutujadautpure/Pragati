const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);


adminSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
