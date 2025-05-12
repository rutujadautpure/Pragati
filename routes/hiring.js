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


router.get('/myHirings', async (req, res) => {
    try {
        const businessId = req.user._id; // Make sure user is logged in and req.user exists
        const myJobs = await Hiring.find({ userId: businessId }).lean();

        res.render('hiring/myHirings', { jobs: myJobs });
    } catch (error) {
        console.error('Error fetching business job hirings:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/applicants/:jobId', async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applicants = await Applicant.find({ hiringId: jobId }).populate('userId');
        const applicantCount = applicants.length;

        const applicantsWithDetails = applicants.map(applicant => {
            return {
                userName: applicant.userId.firstName + " " + applicant.userId.lastName,
                userEmail: applicant.userId.email,
                mob_no: applicant.mob_no,
                age: applicant.age,
                location: applicant.location,
                appliedDate: applicant.createdAt,
            };
        });
        console.error(applicantsWithDetails);

        res.render('./hiring/allapplicants', {
            applicants: applicantsWithDetails, 
            applicantCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.post('/submit/:id',handleHiringForm);

module.exports = router;