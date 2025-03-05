const express = require("express");
const passport = require("passport");
const User = require("../models/user");

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

    
    const newUser = new User({ firstName, lastName, email, mob_no, pinCode, state, district, role });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Signup successful, but auto-login failed. Please log in manually.");
        return res.redirect("/auth/login");
      }
      req.flash("success", "Signup successful! Welcome to our platform.");
      res.redirect("/home");  
    });

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/signup");
  }
});

module.exports = router;
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

  
              res.redirect("/home");
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
    res.json({ message: "Logout successful" });
  });
});


module.exports = router;
