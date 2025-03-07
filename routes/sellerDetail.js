const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Business = require("../models/business");

// GET seller details
router.get("/:id", async (req, res) => {
    console.log("✅ sellerDetails.js is loaded!"); // Debugging

    try {
        const sellerId = req.params.id;
        console.log("Received request for seller ID:", sellerId); // Debugging

        const user = await User.findById(sellerId);
        console.log("seller id is",sellerId);
        console.log("User found:", user); // Debugging

        const business = await Business.findById(sellerId);  // Use findById to search by sellerId (same as _id)
        console.log("Business found:", business); // Debugging

        if (!user) {
            console.log("Error: Seller not found");
            return res.status(404).send("Seller not found");
        }

        if (!business) {
            console.log("Error: Business not found");
        }

        res.render("seller/sellerDetail", { user, business });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
