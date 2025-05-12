const express = require("express");
const Product = require("../models/Product");
const Business = require("../models/business");
const router = express.Router();

// Route to display a single product's details
router.get("/product/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(`Fetching product details for ID: ${productId}`);

        // Fetch product and populate user details
        const product = await Product.findById(productId).populate('UserId');

        if (!product) {
            console.error(`Product with ID ${productId} not found.`);
            return res.status(404).send("Product not found.");
        }

        if (!product.UserId) {
            console.warn(`UserId not found for product: ${productId}`);
            return res.render("products/product-detail", { product, businessDetails: null });
        }

        console.log(`UserId found: ${product.UserId._id}`);

        // Fetch business details using the UserId from the product
        const businessDetails = await Business.findById(product.UserId._id, 'businessPhone businessEmail');

        if (!businessDetails) {
            console.warn(`No business details found for UserId: ${product.UserId._id}`);
        } else {
            console.log("Fetched Business Details:", businessDetails);
        }

        res.render("products/product-detail", { product, businessDetails });
    } catch (err) {
        console.error("Error fetching product details:", err);
        res.status(500).send("Error fetching product details.");
    }
});

module.exports = router;















// const express = require("express");
// const Product = require("../models/product");
// const router = express.Router();

// // Route to display a single product's details
// router.get("/product/:id", async (req, res) => {
//     try {
//         const productId = req.params.id;
//         console.log(`Fetching product details for ID: ${productId}`);

//         // Fetch product and populate user details
//         const product = await Product.findById(productId).populate('UserId');

//         console.log("Fetched Product:", product);

//         if (!product) {
//             console.error(`Product with ID ${productId} not found.`);
//             return res.status(404).send("Product not found.");
//         }

//         if (!product.UserId) {
//             console.warn(`UserId not found for product: ${productId}`);
//         } else {
//             console.log(`UserId found: ${product.UserId._id}`);
//             console.log("User Details:", product.UserId);
//         }

//         res.render("products/product-detail", { product });
//     } catch (err) {
//         console.error("Error fetching product details:", err);
//         res.status(500).send("Error fetching product details.");
//     }
// });


// module.exports = router;
