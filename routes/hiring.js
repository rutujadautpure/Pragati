const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");
const session = require("express-session");
const Hiring = require("../models/hiring")
const {isLoggedIn}=require("../middleware")

router.get('/allaplicants',isLoggedIn,async(req,res)=>{
    try{
        const id = req.user._id
        const jobCount = await Hiring.countDocuments({ userId: id });
        return res.render("./hiring/allapplicants",{jobCount:jobCount});
    }
    catch(error){
        console.log(error);
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    return res.render("./hiring/hiringForm", {id:id});
})


router.post('/submit/:id',handleHiringForm);

module.exports = router;