const Hiring = require("../models/hiring"); // Import the Hiring model
const User = require("../models/user");
const axios = require('axios');

async function handleHiringForm(req, res) {
    try {
        console.log("Received Data:", req.body); // Log received data for debugging

        const {
            salary,
            businessType,
            location,
            jobRole,
            jobRoleDescription,
            jobHours,
            deadlineToApply,
            vacancies,
            contactInfo
        } = req.body;

        // Ensure all required fields are present
        if (
            !salary || !businessType || !location || !location.pinCode || !location.state || !location.district ||
            !jobRole || !jobRoleDescription || !jobHours || !deadlineToApply || !vacancies ||
            !contactInfo || !contactInfo.name || !contactInfo.email || !contactInfo.phone
        ) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Create a new hiring entry
        // await Hiring.create({
        //     salary,
        //     businessType,
        //     location,
        //     jobRole,
        //     jobRoleDescription,
        //     jobHours,
        //     deadlineToApply,
        //     vacancies,
        //     contactInfo
        // });

        //const userId = req.user._id
        const userId = req.params.id;

        const address = `${location.pinCode}, ${location.district}, ${location.state}, India`;

        const geoRes = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                key: apiKey,
                q: address
            }
        });

        if (
            !geoRes.data ||
            !geoRes.data.results ||
            geoRes.data.results.length === 0
        ) {
            return res.status(400).json({ error: "Unable to determine location coordinates." });
        }

        const { lat, lng } = geoRes.data.results[0].geometry;
        const newHiring = new Hiring({
            userId,
            salary,
            businessType,
            location,
            jobRole,
            jobRoleDescription,
            jobHours,
            deadlineToApply,
            vacancies,
            contactInfo,
            geoLocation: {
                type: "Point",
                coordinates: [lng, lat] // Longitude first!
            }
        });

        // Save to database
        await newHiring.save();

        console.log("Hiring entry created successfully!"); // Debugging log
        res.redirect("/home");

        //return res.status(201).json({ message: "Hiring entry added successfully!"});

    } catch (error) {
        console.error("Error adding hiring entry:", error);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
}


module.exports = { handleHiringForm};
