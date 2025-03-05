const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected Successfully");
}
main().catch(err => console.log(err));

// View Engine Setup
app.engine("ejs", ejsMate); //for layout in ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

/* 
app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");  // Stores success messages
    res.locals.error = req.flash("error");      // Stores error messages
    next();
});
 */
// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
