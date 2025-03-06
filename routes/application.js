const express = require("express")
const router = express.Router();
const {handleApplyForm, getAllJobs} = require("../controllers/application");
//const { isLoggedIn } = require("../middleware");
router.get('/home/:id',async(req,res)=>{
    const id=req.params.id;
    return res.render("./worker/home", {id:id});   
})
router.get('/applyForm/:id/:hiringId',async(req,res)=>{
    const id=req.params.id;
    const hiringid=req.params.hiringId;
    return res.render("./worker/applicationForm", {id:id, hiringid:hiringid});   
});
router.post('/application/:id/:hiringId',handleApplyForm);  

router.get("/alljobs/:id", getAllJobs);

module.exports = router;