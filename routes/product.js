const express = require('express');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const Product = require('../models/product'); 

cloudinary.config({ 
    cloud_name: 'dryvfbx1a', 
    api_key: '125726864975736', 
    api_secret: 'EXmo00NXsnokFr_2jFkW8utcFBA'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', 
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif']
    }
});

// Route to get the "Add Product" form
router.get('/add', (req, res) => {
    res.render('./products/addProduct');  
});

// ✅ Route to handle product creation (POST request)
router.post('/add', async (req, res) => {
    try {
        console.log("Received Files:", req.files);

        // Ensure at least one file is uploaded
        if (!req.files || !req.files.productImages) {
            return res.status(400).json({ error: "Please upload at least one image." });
        }

        // ✅ Ensure req.user exists and has _id
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "User not authenticated." });
        }

        const { name, description, price, category, stock } = req.body;
        const uploadedImages = [];
        let imagesArray = Array.isArray(req.files.productImages) ? req.files.productImages : [req.files.productImages];

        // 🔹 Upload each image to Cloudinary
        for (const image of imagesArray) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: 'products' });
            uploadedImages.push(result.secure_url);
        }

        // ✅ Create Product entry with `UserId`
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: uploadedImages,
            UserId: req.user._id  // ✅ Saving UserId
        });

        await product.save();
        res.json({ message: "Product added successfully!", product });
    } catch (error) {
        console.error("Error uploading product:", error);
        res.status(500).send("Error uploading product.");
    }
});

// ✅ Route to display all products
// router.get('/allProducts', async (req, res) => {
//     try {
//         const products = await Product.find().populate('UserId');  // ✅ Populating UserId
//         res.render('products/allProducts', { products });
//     } catch (err) {
//         console.error('Error fetching products:', err);
//         res.status(500).send("Error fetching products.");
//     }
// });


// ✅ Route to display all products with search and category filter




module.exports = router;
