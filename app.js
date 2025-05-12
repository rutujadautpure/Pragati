// Import required modules
const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const sellerDetailsRoute = require("./routes/sellerDetail");
const financeVideoRoutes = require('./routes/financeVideoRoutes');
const axios = require('axios');
const cheerio = require('cheerio');
const ownerProductRoutes = require('./routes/ownerProduct');
require("dotenv").config();
const { Video } = require('./models/video');
app.use(express.static(path.join(__dirname, 'public')));
const {isAuthorized} = require("./middleware")
const Product = require("./models/Product")

const router = express.Router();

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user"); 
const authRoutes = require("./routes/auth");
const finRoutes = require("./routes/finance");
const adminRoutes = require("./routes/admin");
const userSchemeRoutes = require("./routes/userSchemes");

const Hiringroute = require("./routes/hiring")
const Applicationroute = require("./routes/application")

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/myDatabase";
const fileUpload = require('express-fileupload');


const cors = require('cors');
app.use(cors());

// Serve static files from the 'public' folder
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected Successfully");
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

console.log("hello")
main().catch(err => console.log(err));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "homepage")));


// ✅ Express-session must be initialized before passport.session()
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
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
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash("success"),
        error: req.flash("error")
    };
    next();
});


app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp/"
}))

// Admin Home Route


app.get("/", (req, res) => {
    res.render("Homepage/index"); // No need for './' or .ejs extension
});
const businessRoutes = require("./routes/business");
app.use("/business", isAuthorized(["Entrepreneur"]),businessRoutes);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/userSchemes", userSchemeRoutes);

app.get("/home",isAuthorized(["Entrepreneur"]), (req, res) =>{
    res.render("index")});
app.get("/workerhome", isAuthorized(["Worker"]),(req, res) => res.render("./worker/home"));
app.use('/hiring',isAuthorized(["Entrepreneur"]),Hiringroute);
app.use('/worker',isAuthorized(["Worker"]),Applicationroute);

app.use("/seller",sellerDetailsRoute);

app.use("/finance",finRoutes);


app.use('/Videofinance', financeVideoRoutes);
app.use('/myproducts', isAuthorized(["Entrepreneur"]),ownerProductRoutes);
const productRoutes = require("./routes/product");
app.use("/products", isAuthorized(["Entrepreneur"]),productRoutes);
app.get('/allProducts', async (req, res) => {
    try {
        // Capture search and category filter from query parameters
        const { search, category } = req.query;

        // Build filter object based on the query parameters
        let filter = {};

        // If search term is provided, add the name filter
        if (search) {
            filter.name = { $regex: search, $options: 'i' };  // Case-insensitive search
        }

        // If category is provided, add the category filter
        if (category) {
            filter.category = category;
        }

        // Fetch products based on the filter criteria
        const products = await Product.find(filter).populate('UserId');  // Populating UserId

        // Render the same page with filtered products
        res.render('products/allProducts', { products, search, category });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send("Error fetching products.");
    }
});


const financeRoutes = require("./routes/finance");
app.use("/finance",isAuthorized(["Entrepreneur"]), financeRoutes);


const SingleproductRoutes = require('./routes/seperateProductRoutes');
app.use(SingleproductRoutes);





app.use(financeVideoRoutes);


app.get("/dashboard", isAuthorized(["Entrepreneur"]),(req, res) => res.render("./finance/dashboard"));

app.get("/", (req, res) => res.send("Server is running..."));

app.listen(8080, () => {
    console.log("🚀 Server started on port 8080");
});
