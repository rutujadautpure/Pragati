const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema(
  {
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    businessType: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      pinCode: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{6}$/.test(v); // Validates 6-digit Indian pin codes
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
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    jobRoleDescription: {
        type: String,
        required: true,
        trim: true,
      },
    jobHours: {
      type: Number,
      required: true,
      min: 1,
    },
    deadlineToApply: {
      type: Date,
      required: true,
    },
    vacancies: {
      type: Number,
      required: true,
      min: 1,
    },
    contactInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v); 
          },
          message: (props) => `${props.value} is not a valid mobile number!`,
        },
      },
    },
  },
  { timestamps: true }
);

const Hiring = mongoose.model("hiring", hiringSchema);

module.exports = Hiring;
