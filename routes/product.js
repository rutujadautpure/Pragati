const express = require("express");


const multer = require("multer");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");
const Business=require("../models/business");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// // Route to display product form
 router.get("/add",  isLoggedIn, (req, res) => {
     res.render("products/addProduct");
 });

// // Route to handle product submission
router.post("/add",  isLoggedIn, upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 }
]), async (req, res) => {
   
    try {
        const { name, description, price, category, stock } = req.body;

        const newProduct = new Product({
        
            UserId: req.user._id, // Assuming user is linked to a business
            name,
            description,
            price,
            category,
            stock,
            productImages: {
                image1: req.files["productImage1"][0].path,
                image2: req.files["productImage2"][0].path,
                image3: req.files["productImage3"][0].path
            }
        });

        await newProduct.save();
        res.redirect("/home"); // Redirect to user dashboard after adding product
    } catch (err) {
        res.status(400).send(err.message);
    }
});



// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
 ///const Product = require('../models/product');  // Adjust the path to your product model

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// Route for creating a new product
// router.post('/addproduct', upload.array('productImage1', 3), async (req, res) => {
//     try {
//         const newProduct = new Product({
//             name: req.body.name,
//             category: req.body.category,
//             price: req.body.price,
//             description: req.body.description,
//             stock: req.body.stock,
//             productImages: {
//                 image1: req.files[0] ? req.files[0].path : null,
//                 image2: req.files[1] ? req.files[1].path : null,
//                 image3: req.files[2] ? req.files[2].path : null,
//             },
//         });

//         await newProduct.save();
//         res.redirect('/allProducts');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server Error');
//     }
// });





// Route to display all products
router.get('/allProducts', async (req, res) => {
    try {
        const products = await Product.find().populate('UserId');
        
        res.render('products/allProducts', { products });
    } catch (err) {
        console.error('Error fetching products:', err);  // Log the specific error
        res.status(500).send("Error fetching products.");
    }
});
















module.exports = router;


