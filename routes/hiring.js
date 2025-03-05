const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");
const session = require("express-session");


router.get('/',async(req,res)=>{
    return res.render("./hiring/hiringForm");
})

router.post('/allaplicants',async(req,res)=>{
    console.log(req.session.userId);
    try{
        const id = req.session.userId;
        const jobCount = await Hiring.countDocuments({ userId: id });
        return res.render("./hiring/allapplicants",{jobCount:jobCount});
    }
    catch(error){
        console.log(error);
    }
    
})
router.post('/:id',handleHiringForm);

module.exports = router;