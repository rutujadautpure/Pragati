const Applicant=require("../models/application")
const Business = require("../models/business")
const Hiring = require("../models/hiring")

async function handleApplyForm(req, res) {
    try {
        const { name, mob_no, location, age } = req.body;

        if (!name || !mob_no || !location || !age) {
            return res.status(400).json({ message: "All fields all are required." });
        }

        const { pinCode, state, district } = location;
        if (!pinCode || !state || !district) {
            return res.status(400).json({ message: "Complete location details are required." });
        }
        const userId = req.user._id
       // const hiringID = 

       //const userId = req.params.id;
       const hiringId = req.params.hiringId;

        const newApplicant = new Applicant({
            userId,
            hiringId,
            name,
            mob_no,
            location: { pinCode, state, district },
            age,
        });

        await newApplicant.save();
       // res.status(201).json({ message: "Application submitted successfully", applicant: newApplicant });
       res.redirect("/worker/home");
    } catch (error) {
        console.error("Error saving applicant:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAllJobs(req, res) {
    try {
        // Fetch all job listings
        const jobListings = await Hiring.find().lean();
        // Fetch business names asynchronously
        const businessList = [];

        for (let job of jobListings) {
            const business = await Business.findOne({ _id: job.userId }).lean();
            businessList.push(business ? business.businessName : "Unknown Business");
        }

        //const id = req.params.id;
        // const loginuser= req.user._id
        // console.log(loginuser)
        res.render("./worker/alljobs", { jobs: jobListings, business: businessList});

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Internal Server Error");
    }
}




module.exports = { handleApplyForm,
    getAllJobs
 };
