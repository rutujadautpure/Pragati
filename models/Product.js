const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    stock: Number,
    images: [
        {
            url: { type: String, required: true },
            filename: { type: String, required: true }
        }
    ],
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
