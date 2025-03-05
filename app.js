// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user"); // Ensure this path is correct
const authRoutes = require("./routes/auth");

const Hiringroute = require("./routes/hiring")
const Applicationroute = require("./routes/application")

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/myDatabase";

// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected Successfully");
}
main().catch(err => console.log(err));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "homepage")));

app.use('/hiring',Hiringroute);
app.use('/worker',Applicationroute);
// ✅ Express-session must be initialized before passport.session()
app.use(session({
    secret: 'your-secret-key', // You should use a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session expiration (optional, here 1 day)
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true // Prevent JavaScript from accessing the cookie (recommended for security)
    }
}));

// ✅ Initialize Passport after express-session
app.use(passport.initialize());
app.use(passport.session());

// ✅ Configure Passport authentication
passport.use(new LocalStrategy(User.authenticate()));passport.serializeUser(function(user, done) {
    done(null, user._id);  // Store the user's ID in the session cookie
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id); // Find the user by their ID
        done(null, user);  // Store the user object in the session
    } catch (err) {
        done(err);  // If an error occurs, call done with the error
    }
});
// Flash Messages
app.use(flash());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash("success"),
        error: req.flash("error")
    };
    next();
});



app.get("/", (req, res) => {
    res.render("index");
});
const businessRoutes = require("./routes/business");
app.use("/business", businessRoutes);

app.use("/auth", authRoutes);
app.get("/home", (req, res) => res.render("index"));
app.get("/workerhome", (req, res) => res.render("./worker/home"));


const productRoutes = require("./routes/product");
app.use("/products", productRoutes);

const financeRoutes = require("./routes/finance");
app.use("/finance", financeRoutes);

app.get("/dashboard", (req, res) => res.render("./finance/dashboard"));

app.get("/", (req, res) => res.send("Server is running..."));

app.listen(8080, () => {
    console.log("🚀 Server started on port 8080");
});
