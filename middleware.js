module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the URL for redirecting after login
        req.flash("error", "Please log in first"); // Flash message for login requirement
        return res.redirect("/auth/login"); // Redirect to the login page
    }
    next();
};

