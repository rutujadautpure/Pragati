const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");
const session = require("express-session");
const Hiring = require("../models/hiring")
const Applicant = require("../models/application")
const Business = require("../models/business")
const User = require("../models/user")
const {isLoggedIn}=require("../middleware")

// router.get('/',isLoggedIn,async(req,res)=>{
//     const id = req.user._id;
//     return res.render("./hiring/hiringForm", {id:id});
// })

router.get("/", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get logged-in user ID

        console.log("User ID:", userId); // Debugging

        // Find business details based on the user ID (which is also `_id` in Business)
        const business = await Business.findById(userId);
        console.log("Business Data:", business); // Debugging

        // Find user details
        const user = await User.findById(userId);
        console.log("User Data:", user); // Debugging

        // If business or user is not found, send empty values
        if (!business || !user) {
            return res.render("./hiring/hiringForm", {
                id: userId,
                businessType: "",
                pinCode: "",
                state: "",
                district: "",
                contactName: "",
                contactEmail: "",
                contactPhone: "",
            });
        }

        // Extract necessary data
        const businessType = business.category || "";
        const pinCode = user.pinCode || "";
        const state = user.state || "";
        const district = user.district || "";
        const contactName = `${user.firstName} ${user.lastName}`;
        const contactEmail = business.businessEmail || "";
        const contactPhone = business.businessPhone || "";

        // Render the form with pre-filled data
        return res.render("./hiring/hiringForm", {
            id: userId,
            businessType,
            pinCode,
            state,
            district,
            contactName,
            contactEmail,
            contactPhone,
        });

    } catch (error) {
        console.error("Error in hiring route:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/allaplicants', isLoggedIn, async (req, res) => {
    try {
        const id = req.user._id;
        
        // Fetch all hiring objects for the logged-in user
        const hirings = await Hiring.find({ userId: id });

        if (!hirings.length) {
            return res.render("./hiring/allapplicants", { jobCount: 0, applicantCount: 0 });
        }

        // Extract all hiring IDs
        const hiringIds = hirings.map(hiring => hiring._id);

        const applicantCount = await Applicant.countDocuments({ hiringId: { $in: hiringIds } });
        const applicants = await Applicant.find({ hiringId: { $in: hiringIds } })
                                          .limit(applicantCount);

        return res.render("./hiring/allapplicants", { jobCount: hirings.length, applicantCount,applicants });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});


router.post('/submit/:id',handleHiringForm);

module.exports = router;