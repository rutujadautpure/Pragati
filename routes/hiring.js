const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");

router.get('/',async(req,res)=>{
    return res.render("./hiring/hiringForm");
})
router.post('/',handleHiringForm);

module.exports = router;