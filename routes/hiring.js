const express = require("express")
const router = express.Router();
const {handleHiringForm} = require("../controllers/hiring");


router.post('/',handleHiringForm);

// router.post('/',handleUserSignUp);
// router.post('/login',handleAuthentication);
// router.get('/logout',handleLogout);
// router.get("/user/login", (req, res) => {
//     //res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); // Set cache control
//     res.render("login");
// });


module.exports = router;