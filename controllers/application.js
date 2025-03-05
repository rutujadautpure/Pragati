const Applicant=require("../models/application")


async function handleApplyForm(req, res) {
    try {
        const { name, mob_no, location, age } = req.body;

        if (!name || !mob_no || !location || !age) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const { pinCode, state, district } = location;
        if (!pinCode || !state || !district) {
            return res.status(400).json({ message: "Complete location details are required." });
        }

        const newApplicant = new Applicant({
            name,
            mob_no,
            location: { pinCode, state, district },
            age,
        });

        await newApplicant.save();
        res.status(201).json({ message: "Application submitted successfully", applicant: newApplicant });
    } catch (error) {
        console.error("Error saving applicant:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { handleApplyForm };
