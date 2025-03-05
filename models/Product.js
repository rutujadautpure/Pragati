const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true }, // Foreign key to Business
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    productImages: {
        image1: { type: String,  },
        image2: { type: String,  },
        image3: { type: String,  }
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
