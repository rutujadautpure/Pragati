const express = require("express");
const router = express.Router();
const Admin = require("../models/admin"); 
const passport = require("passport");
const { Video } = require('../models/video');

router.get("/login", (req, res) => {
    res.render("admin/login"); 
});


router.post("/register", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      console.error("Validation Error: Email and password are required.");
      req.flash("error", "Email and password are required");
      
    }
  
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        console.error("Registration Error: Admin with email already exists.");
        req.flash("error", "Admin with this email already exists");
        
      }
  
      const newAdmin = new Admin({ email });
      
      // Check if register function is available
      if (typeof Admin.register !== "function") {
        throw new Error("Admin.register is not defined. Check if passport-local-mongoose is applied correctly.");
      }
  
      await Admin.register(newAdmin, password); // Passport-local-mongoose handles hashing
  
      console.log("Admin registered successfully:", email);
      req.flash("success", "Admin registered successfully!");
      res.redirect("/admin/login");
    } catch (error) {
      console.error("Error during admin registration:", error.stack);
      req.flash("error", "Error registering admin");
      
    }
  });

  // Admin Login
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        req.flash("error", "Admin not found");
        return res.redirect("/admin/login");
      }
  
      admin.authenticate(password, (err, authenticatedAdmin) => {
        if (err) {
          console.error("Error during authentication:", err);
          req.flash("error", "Error in authentication");
          return res.redirect("/admin/login");
        }
  
        if (!authenticatedAdmin) {
          req.flash("error", "Invalid credentials");
          return res.redirect("/admin/login");
        }
  
        req.login(authenticatedAdmin, (err) => {
          if (err) {
            console.error("Login error:", err);
            req.flash("error", "Login failed");
            return res.redirect("/admin/login");
          }
  
          console.log(`Admin logged in: ${admin.email}`);
          return res.redirect("/admin/home"); 
        });
      });
  
    } catch (error) {
      console.error("Server error:", error);
      req.flash("error", "Server error");
      res.redirect("/admin/login");
    }
  });
  
// Admin Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/admin/login");
  });
});

router.get('/home', (req, res) => {
    res.render('admin/home');
});

router.get('/addVideo', (req, res) => {
    res.render('admin/addVideo', {
      categories: [
        'Finance',
        'Tax',
        'Fashion, Handicraft and Luggage',
        'Home Decor, Furniture and Hardware',
        'Electrical, Electronics and Software',
        'Books, Office Supplies and Madla',
        'Personal Care Health and Beauty',
        'Sports, Hobbies, Toys and Events',
        'Others and Services',
      ],
    });
  });

  function convertToEmbedUrl(url) {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/.*[?&]v=)([^?&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    throw new Error('Invalid YouTube URL');
  }
  
  // Handle video submission
  router.post('/addVideo', async (req, res) => {
    try {
      const { name, url, description, category } = req.body;
  
      // Validate fields
      if (!name || !url || !description || !category) {
        return res.status(400).send('All fields are required');
      }
  
      // Convert URL to embed format
      const embedUrl = convertToEmbedUrl(url);
  
      // Save video
      const newVideo = new Video({ name, url: embedUrl, description, category });
      await newVideo.save();
      res.redirect('/admin/addVideo');
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message || 'Internal Server Error');
    }
  });

  router.get('/showVideo', async (req, res) => {
    try {
      const videos = await Video.find({});
      const categories = [
        'Finance',
        'Tax',
        'Fashion, Handicraft and Luggage',
        'Home Decor, Furniture and Hardware',
        'Electrical, Electronics and Software',
        'Books, Office Supplies and Madla',
        'Personal Care Health and Beauty',
        'Sports, Hobbies, Toys and Events',
        'Others and Services',
      ];
      res.render('admin/addVideo', { categories, videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).send('Error fetching videos');
    }
  });
  router.delete('/deleteVideo/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params; // Get videoId from URL params
    await Video.findByIdAndDelete(videoId);
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting video' });
  }
});

  

module.exports = router;
