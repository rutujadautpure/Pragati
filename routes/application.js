const express = require("express")
const router = express.Router();
const {handleApplyForm, getAllJobs, getJobsByDistrict} = require("../controllers/application");
const { isLoggedIn } = require("../middleware");
router.get('/home',async(req,res)=>{
    //const id=req.params.id;
    return res.render("./worker/home");   
})

router.get('/jobsByDistrict',isLoggedIn,getJobsByDistrict)

router.get("/alljobs", isLoggedIn,getAllJobs);

router.get('/applyForm/:hiringId',isLoggedIn,async(req,res)=>{
    //const id=req.params.id;
    const hiringid=req.params.hiringId;
    return res.render("./worker/applicationForm", {hiringid:hiringid});   
});

router.post('/application/:hiringId',isLoggedIn,handleApplyForm);  



module.exports = router;