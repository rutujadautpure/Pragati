const express = require("express");
const router = express.Router();
const multer = require("multer");
const Business = require("../models/business");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Ensure the "uploads" folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route to render the business registration form
router.get("/register", (req, res) => {
    res.render("business/businessForm");
});

// Route to handle business registration form submission
router.post("/register", upload.single("businessDoc"), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized: Please log in first.");
        }

        const { category, businessName, description, businessEmail, supportEmail, businessPhone, supportPhone } = req.body;

        const newBusiness = new Business({
            _id: req.user._id, 
            category,
            businessName:"business",
            tradeName:"business",
            incorporationDate,
            description,
            businessDoc: req.file ? req.file.path : null,
            businessEmail,
            supportEmail,
            businessPhone,
            supportPhone
        });

        await newBusiness.save();
        res.redirect("/home"); // Redirect after successful submission
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
