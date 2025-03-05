const express = require("express")
const router = express.Router();
const {handleApplyForm, getAllJobs} = require("../controllers/application");

router.get('/application',async(req,res)=>{
    return res.render("./application/applicationForm");   //Show all application here
})
router.post('/application/:id/:hiringId',handleApplyForm);
router.get("/alljobs", getAllJobs);

module.exports = router;