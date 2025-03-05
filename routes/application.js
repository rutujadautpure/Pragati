const express = require("express")
const router = express.Router();
const {handleApplyForm} = require("../controllers/application");

router.get('/application',async(req,res)=>{
    return res.render("./application/applicationForm");
})
router.post('/application',handleApplyForm);

module.exports = router;