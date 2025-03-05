const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mob_no: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    location: {
      pinCode: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{6}$/.test(v); 
          },
          message: (props) => `${props.value} is not a valid pin code!`,
        },
      },
      state: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18, 
    },
  },
  { timestamps: true }
);

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
