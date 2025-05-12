require('dotenv').config();
const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const Admin = require("../models/admin");
const axios = require('axios');

const router = express.Router();
router.get("/login", (req, res) => {
    res.render("auth/login"); 
  });

  router.get("/signup", (req, res) => {
    res.render("auth/signup"); 
  });
  
// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, mob_no, pinCode, state, district, role } = req.body;
     const address = `${state}, ${district}, ${pinCode}`;

    // Geocode the address to get coordinates (longitude, latitude)
    const geocodeResponse = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: address,
        key: process.env.OPENCAGE_API_KEY,  // Your OpenCage API Key
      },
    });

    // Get coordinates from the geocode response
    const coordinates = geocodeResponse.data.results[0]?.geometry;

    if (!coordinates) {
      return res.status(400).json({ message: "Unable to fetch coordinates for the provided address." });
    }

    const newUser = new User({ firstName, lastName, email, mob_no, pinCode, state, district, role,location: { // Store the location data
        coordinates: [coordinates.lng, coordinates.lat],  // Longitude and Latitude
      }, });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Signup successful, but auto-login failed. Please log in manually.");
        return res.redirect("/auth/login");
      }

      req.flash("success", "Signup successful! Welcome to our platform.");
      
      if (registeredUser.role === "Entrepreneur") {
        return res.redirect("/business/register"); // Redirect to business registration page
      } else {
        return res.render("./worker/home"); // Normal user redirection
      }

    });

  } catch (error) {  // Corrected catch block
    req.flash("error", error.message);
    res.redirect("/auth/signup");
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          req.flash("error", "User not found");
          return res.redirect("/auth/login");
      }

      user.authenticate(password, (err, authenticatedUser) => {
          if (err) {
              req.flash("error", "Error in authentication");
              return res.redirect("/auth/login");
          }
          if (!authenticatedUser) {
              req.flash("error", "Invalid credentials");
              return res.redirect("/auth/login");
          }

          req.login(authenticatedUser, (err) => {
              if (err) {
                  req.flash("error", "Login failed");
                  return res.redirect("/auth/login");
              }
              //req.session.userId = user._id;
              console.log(user._id);
              if (user.role === "Entrepreneur") {
                //return res.redirect(`/home/${user._id}`); 
                return res.redirect("/home"); 
              } else {
                //const id=user._id
                //return res.redirect(`/worker/home/${id}`); // Normal user redirection
                return res.render("./worker/home"); // Normal user redirection
              }
              
          });
      });

  } catch (error) {
      req.flash("error", "Server error");
      res.redirect("/auth/login");
  }
});



router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});



module.exports = router;
