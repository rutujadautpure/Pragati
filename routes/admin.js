const express = require("express");
const router = express.Router();
const Admin = require("../models/admin"); 
const Applicant = require("../models/application"); 
const Business = require("../models/business"); 
const passport = require("passport");

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

//View all job seeker
router.get("/job-seekers", async (req, res) => {
  try {
      const jobSeekers = await Applicant.aggregate([
          {
              $group: { 
                  _id: "$userId",  // Group by userId to count unique job seekers
                  name: { $first: "$name" }, 
                  mob_no: { $first: "$mob_no" }, 
                  location: { $first: "$location" }, 
                  age: { $first: "$age" } 
              }
          }
      ]);

      const jobSeekerCount = jobSeekers.length; // Count unique job seekers

      return res.render("./admin/jobSeekers", { jobSeekers, jobSeekerCount });

  } catch (error) {
      console.error("Error fetching job seekers:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

//View all business
router.get("/businesses", async (req, res) => {
  try {
      const businesses = await Business.find({}, "businessName businessEmail businessPhone");

      return res.render("./admin/business", { businesses, businessCount: businesses.length });

  } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/home", async (req, res) => {
  try {
    // Count distinct job seekers based on userId
    const jobSeekerCount = await Applicant.aggregate([
        { $group: { _id: "$userId" } }, // Group by userId
        { $count: "count" } // Count unique userIds
    ]);

    // Count distinct businesses based on _id (as businesses already have unique _id per entry)
    const businessCount = await Business.countDocuments();

    return res.render("./admin/home", { 
        jobSeekerCount: jobSeekerCount.length > 0 ? jobSeekerCount[0].count : 0, 
        businessCount 
    });

  }catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get('/home', (req, res) => {
//     //res.render('admin/home');
//     res.redirect("/admin/dashboard");
// });


module.exports = router;
