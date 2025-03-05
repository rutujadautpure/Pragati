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

const dashboardData = {
    totalSales: 1000,
    revenue: 5000,
    expenses: 2000,
    transactions: [
        { date: '2025-03-01', type: 'Income', amount: 1500, category: 'Sales' },
        { date: '2025-03-02', type: 'Expense', amount: 500, category: 'Supplies' },
        { date: '2025-03-03', type: 'Expense', amount: 700, category: 'Rent' }
    ],
    pieChartData: {
        labels: ['Rent', 'Salaries', 'Supplies', 'Other'],
        data: [400, 1000, 300, 500],
    },
    barChartData: {
        labels: ['January', 'February', 'March'],
        sales: [1000, 1500, 2000],
        expenses: [500, 700, 1000]
    },
    lineChartData: {
        labels: ['2021', '2022', '2023', '2024'],
        revenue: [20000, 25000, 30000, 35000]
    }
};

app.get('/dashboard', (req, res) => {
    res.render('./finance/dashboard.ejs', { dashboardData });

});

app.get("/", (req, res) => {
    res.render("index");
});
const businessRoutes = require("./routes/business");
app.use("/business", businessRoutes);
// Routes
// Start Server
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
