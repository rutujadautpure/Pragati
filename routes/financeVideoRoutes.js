const express = require('express');
const { Video } = require('../models/video');
const Business = require('../models/business');
const router = express.Router();
const {isAuthorized} = require("../middleware")

// Route to fetch both finance-related videos and category-related videos
router.get('/videos/finance',isAuthorized(["Entrepreneur"]), async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming user is authenticated and user ID is available
    console.log(userId);
    // Fetch the business category for the user
    const business = await Business.findOne({ _id: userId });
    if (!business) {
      return res.status(404).send('Business not found');
    }

    // Fetch finance-related videos
    const financeVideos = await Video.find({ category: 'Finance' });

    // Fetch category-related videos based on the user's business category
    const categoryVideos = await Video.find({ category: business.category });

    // Send both the finance videos and category-related videos to the view
    res.render('videos/finance_videos', {
      videos: financeVideos,
      categoryVideos: categoryVideos,
      categoryName: business.category  // Pass the business category name
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
