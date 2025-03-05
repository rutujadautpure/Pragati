const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    stock: Number,
    productImages: {
        image1: String,
        image2: String,
        image3: String,
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
