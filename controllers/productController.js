const cloudinary = require('cloudinary').v2;  // Cloudinary configuration
const Product = require('../models/Product');  // Importing the Product model
const fs = require('fs');

// Cloudinary configuration
// Cloudinary config
cloudinary.config({
    cloud_name: 'dryvfbx1a',
    api_key: '125726864975736',
    api_secret: 'EXmo00NXsnokFr_2jFkW8utcFBA',
});

// Create new product and upload image to Cloudinary
module.exports.createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Please upload at least one image." });
        }

        // Upload images to Cloudinary and store only the URL strings
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url; // ✅ Store only the string, not an object
            })
        );

        // Create and save product
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            images: uploadedImages, // ✅ This is now an array of strings
        });

        await product.save();
        res.redirect('/products/allProducts'); 
    } catch (error) {
        console.error("Error uploading product:", error);
        res.status(500).send("Error uploading product.");
    }
};