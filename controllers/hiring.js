const Hiring = require("../models/hiring"); // Import the Hiring model
const User = require("../models/user");

// Handle hiring form submission
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
            contactInfo
        });

        // Save to database
        await newHiring.save();

        console.log("Hiring entry created successfully!"); // Debugging log
        res.redirect(`/home/${userId}`);

        //return res.status(201).json({ message: "Hiring entry added successfully!"});

    } catch (error) {
        console.error("Error adding hiring entry:", error);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
}

module.exports = { handleHiringForm };
