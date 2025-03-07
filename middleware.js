module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the URL for redirecting after login
        req.flash("error", "Please log in first"); // Flash message for login requirement
        return res.redirect("/auth/login"); // Redirect to the login page
    }
    next();
};



module.exports.isAuthorized = (roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash("error", "Please log in first");
            return res.redirect("/auth/login");
        }

        const userRole = req.user.role; // Assuming the role is stored in `req.user.role`

        if (roles.includes(userRole)) {
            return next(); // If the role matches, proceed to the next middleware
        } else {
            req.flash("error", "You do not have permission to access this page");
            return res.redirect("/auth/login"); // Redirect if the user doesn't have the required role
        }
    };
};
