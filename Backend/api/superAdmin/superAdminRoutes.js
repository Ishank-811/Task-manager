const express = require("express");
const router = express.Router();
const passport =  require("passport"); 
const superAdminController = require("./superAdminController");

router.get("/fetchAllOrganization", 
passport.authenticate("level2", { session: false }), superAdminController.fetchAllOrganization);

router.patch("/AllowOrganization/:organizationId",  superAdminController.AllowOrganization); 
router.post("/addOrganization" ,superAdminController.addOrganization); 
router.patch("/updateOrganization/:organizationId" ,superAdminController.updateOrganization ); 

module.exports = router;