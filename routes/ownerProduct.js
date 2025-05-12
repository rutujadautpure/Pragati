const express = require('express');
 // The Product model
const router = express.Router();
const Product = require("../models/product");

// Middleware to check if the user is authenticated
const { isLoggedIn } = require('../middleware');

// Route to view all the products of the seller
router.get('/my-products', isLoggedIn, async (req, res) => {
    try {
        const products = await Product.find({ UserId: req.user._id }); // Get products by the logged-in seller's UserId
        res.render('./products/myproducts', { products });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Route to edit a product
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, UserId: req.user._id }); // Fetch the product by ID and check if the logged-in seller owns it
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('./products/edit-product', { product });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Route to update a product
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { name, category, price, description, stock, images } = req.body;
    try {
        const product = await Product.findOne({ _id: req.params.id, UserId: req.user._id });
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Update the product
        product.name = name;
        product.category = category;
        product.price = price;
        product.description = description;
        product.stock = stock;
        product.images = images; // Ensure images are handled properly (e.g., Cloudinary URLs)
        
        await product.save();
        res.redirect('/myproducts/my-products'); // Redirect to the product list page after update
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
