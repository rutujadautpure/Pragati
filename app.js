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
// ✅ Express-session must be initialized before passport.session()
app.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false, // Set to false to prevent empty sessions
      cookie: { secure: false }, // Change to true in production with HTTPS
    })
);

// ✅ Initialize Passport after express-session
app.use(passport.initialize());
app.use(passport.session());

// ✅ Configure Passport authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// vaish

app.get("/", (req, res) => {
    res.render("index");
});
const businessRoutes = require("./routes/business");
app.use("/business", businessRoutes);
// Routes
// Start Server
app.use("/auth", authRoutes);
app.get("/home", (req, res) => res.render("index"));

const productRoutes = require("./routes/product");
app.use("/products", productRoutes);

app.get("/", (req, res) => res.send("Server is running..."));

app.listen(8080, () => {
    console.log("🚀 Server started on port 8080");
});
