const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");
const session = require("express-session");
const Hiring = require("../models/hiring")
const Applicant = require("../models/application")
const {isLoggedIn}=require("../middleware")

router.get('/',isLoggedIn,async(req,res)=>{
    const id = req.user._id;
    return res.render("./hiring/hiringForm", {id:id});
})


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