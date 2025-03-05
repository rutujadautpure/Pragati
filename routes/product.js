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
const upload = multer({ storage });

// Route to display product form
router.get("/add",  isLoggedIn, (req, res) => {
    res.render("products/addProduct");
});

// Route to handle product submission
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

module.exports = router;
