const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");
const session = require("express-session");
const Hiring = require("../models/hiring")
const {isLoggedIn}=require("../middleware")

router.get('/',isLoggedIn,async(req,res)=>{
    const id = req.user._id;
    return res.render("./hiring/hiringForm", {id:id});
})


router.get('/allaplicants',isLoggedIn,async(req,res)=>{
    try{
        const id = req.user._id; 
        const jobCount = await Hiring.countDocuments({ userId: id });
        return res.render("./hiring/allapplicants",{jobCount:jobCount});
    }
    catch(error){
        console.log(error);
    }
    
})



router.post('/submit/:id',handleHiringForm);

module.exports = router;