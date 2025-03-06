const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// Route to display a single product's details
router.get("/product/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('UserId');

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        res.render("products/product-detail", { product });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Error fetching product details.");
    }
});

module.exports = router;
