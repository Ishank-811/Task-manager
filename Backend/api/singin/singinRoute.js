const express= require("express"); 
const router = express.Router(); 
const passport = require("passport") ;
const singinController = require("./singinController");
var pass = require("../../middleware/passportSingin");

pass.initializer(passport);

router.post("/singinAsOrganization",
passport.authenticate("local", { session: false }) ,
singinController.singinAsOrganization  ); 
 
module.exports = router ;