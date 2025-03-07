const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Fashion, Handicraft and Luggage",
            "Home Decor, Furniture and Hardware",
            "Electrical, Electronics and Software",
            "Books, Office Supplies and Madla",
            "Personal Care Health and Beauty",
            "Sports, Hobbies, Toys and Events",
            "Others and Services",
            "Food and Beverage",
            "Automotive",
            "Real Estate",
            "Health and Wellness",
            "Education and Training",
            "Travel and Tourism",
            "Entertainment and Media",
            "Pet Supplies and Services",
            "Financial Services",
            "Technology and Gadgets",
            "Art and Craft",
            "Construction and Renovation",
            "Business Services"
        ]
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
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
