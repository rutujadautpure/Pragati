const Business = require("../models/business")
const Hiring = require("../models/hiring")
const Applicant = require("../models/application")
const User = require("../models/user")
const axios = require("axios");
require("dotenv").config();



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


// async function getAllJobs(req, res) {
//     try {
//         const jobListings = await Hiring.find().lean();
//         const businessList = [];

//         for (let job of jobListings) {
//             const business = await Business.findOne({ _id: job.userId }).lean();
//             businessList.push(business ? business.businessName : "Unknown Business");
//         }

//         // Get the logged-in user's applied jobs
//         const appliedJobs = await Applicant.find({ userId: req.user._id }).select("hiringId").lean();
//         const appliedJobIds = appliedJobs.map(app => app.hiringId.toString());

//         res.render("./worker/alljobs", { 
//             jobs: jobListings, 
//             business: businessList, 
//             appliedJobIds 
//         });

//     } catch (error) {
//         console.error("Error fetching jobs:", error);
//         res.status(500).send("Internal Server Error");
//     }
// }


async function getAllJobs(req, res){
    try {
        const jobListings = await Hiring.find().lean();
        const businessList = [];

        for (let job of jobListings) {
            const business = await Business.findOne({ _id: job.userId }).lean();
            businessList.push(business ? business.businessName : "Unknown Business");
        }

        // Get applied job IDs for the user
        const appliedJobs = await Applicant.find({ userId: req.user._id }).select("hiringId").lean();
        const appliedJobIds = appliedJobs.map(app => app.hiringId.toString());

        res.render("./worker/alljobs", { 
            jobs: jobListings, 
            business: businessList, 
            appliedJobIds, 
            filter: "all" // Default filter type
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function getJobsByDistrict (req,res){
    try {
        const user = await User.findById(req.user._id).lean();
        if (!user) {
            return res.status(404).send("User not found");
        }

        const jobListings = await Hiring.find({ "location.district": user.district }).lean();
        const businessList = [];

        for (let job of jobListings) {
            const business = await Business.findOne({ _id: job.userId }).lean();
            businessList.push(business ? business.businessName : "Unknown Business");
        }

        // Get applied job IDs for the user
        const appliedJobs = await Applicant.find({ userId: req.user._id }).select("hiringId").lean();
        const appliedJobIds = appliedJobs.map(app => app.hiringId.toString());

        res.render("./worker/alljobs", { 
            jobs: jobListings, 
            business: businessList, 
            appliedJobIds, 
            filter: "district" 
        });

    } catch (error) {
        console.error("Error fetching jobs by district:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function getNearbyJobs(req, res) {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user || !user.location || !user.location.coordinates) {
      return res.status(400).send("User location coordinates not found");
    }

    const userCoords = user.location.coordinates; // [lng, lat]

    // Find nearby jobs within 20km (20,000 meters)
    const nearbyJobs = await Hiring.find({
        geoLocation: {
            $nearSphere: {
            $geometry: {
                type: "Point",
                coordinates: userCoords,
            },
            $maxDistance: 200000, // 300km
            },
        },
    });

    // Get corresponding business names
    const businessList = [];
    for (let job of nearbyJobs) {
      const business = await Business.findById(job.userId).lean();
      businessList.push(business ? business.businessName : "Unknown Business");
    }

    // Check which jobs the user has applied to
    const appliedJobs = await Applicant.find({ userId: req.user._id }).select("hiringId").lean();
    const appliedJobIds = appliedJobs.map(app => app.hiringId.toString());

    res.render("./worker/alljobs", {
      jobs: nearbyJobs,
      business: businessList,
      appliedJobIds,
      filter: "nearby",
    });

  } catch (error) {
    console.error("Error fetching nearby jobs:", error);
    res.status(500).send("Internal Server Error");
  }
}


async function openApplyForm (req,res){
    try {
        const hiringid = req.params.hiringId;
        const user = await User.findById(req.user._id); // Fetch logged-in user's details

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.render("./worker/applicationForm", {
            hiringid: hiringid,
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
}


module.exports = { handleApplyForm,
    getAllJobs,
    getJobsByDistrict,
    openApplyForm,
    getNearbyJobs
 };
