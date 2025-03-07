const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    stock: Number,
    images: [
        {
            type: String, // ✅ Store Cloudinary URLs
            required: true
        }
    ],
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
