
const express = require('express');
const multer = require('multer'); // To handle file uploads
const productController = require('../controllers/productController');
const Product = require("../models/product");
const { createProduct } = require('../controllers/productController'); // Import the controller functions
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();



const path = require('path');


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Folder name in Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif']
    }
});


// Multer configuration for file uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const isValid = filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase());
        isValid ? cb(null, true) : cb(new Error("Only image files are allowed"));
    }
});



// Route to get the "Add Product" form (GET request)
router.get('/add', (req, res) => {
    res.render('./products/addProduct');  // Ensure this matches the file name
});


// Route to handle product creation (POST request)
// Route to handle product creation (POST request)
router.post('/add', upload.array('productImages', 5), productController.createProduct);









// Route to display all products
router.get('/allProducts', async (req, res) => {
    try {
        // const products = await Product.find().populate('UserId');
        const products = await Product.find({});

        res.render('./products/allProducts', { products : products});
    } catch (err) {
        console.error('Error fetching products:', err);  // Log the specific error
        res.status(500).send("Error fetching products.");
    }
});

module.exports = router;

