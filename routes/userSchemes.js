const express = require("express");
const router = express.Router();
const Scheme = require("../models/scheme"); 

router.get("/allscheme", async (req, res) => {
  try {
    const schemes = await Scheme.find();
    const schemeTypes = await Scheme.distinct("schemeType"); // Fetch distinct scheme types

    res.render("userSchemes/allschemes", { schemes, schemeTypes });
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
