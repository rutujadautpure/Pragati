<<<<<<< HEAD
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the URL for redirecting after login
        req.flash("error", "Please log in first"); // Flash message for login requirement
        return res.redirect("/auth/login"); // Redirect to the login page
    }
    next();
};

=======
module.exports = (req, res, next) => {
    console.log("Auth middleware executed");
    next();
};
>>>>>>> 3043c2e31d0a0ad189d6ba7b5843bfce9569f0ef
