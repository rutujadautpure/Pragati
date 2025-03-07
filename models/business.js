const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Fashion, Handicraft and Luggage",
            "Home Decor, Furniture and Hardware",
            "Electrical, Electronics and Software",
            "Books, Office Supplies and Media",
            "Personal Care Health and Beauty",
            "Sports, Hobbies, Toys and Events",
            "Others and Services"
        ]
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    tradeName: {
        type: String,
        trim: true
    },
    incorporationDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    businessEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    supportEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    businessPhone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    supportPhone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
}, { timestamps: true });


const Business = mongoose.model("business", businessSchema);
module.exports = Business;
