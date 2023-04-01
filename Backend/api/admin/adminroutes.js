const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("./adminController");
require("../../middleware/passportVerify");
router.get(
  "/fetchingUsers",
  passport.authenticate("level2", { session: false }),
  adminController.fetchingUsers
);
router.post("/creatingProject", adminController.creatingPorject);
router.get(
  "/fetchProjects",
  passport.authenticate("level2", { session: false }),
  adminController.fetchProjects
);

router.patch("/deleteuser", adminController.deleteuser);
router.post("/addEmployees", adminController.addEmployees);
router.get("/showEmployeeProjects", adminController.showEmployeeProjects);
router.get("/fastestPaceProject" , adminController.fastestPaceProject); 
router.get("/fetchProjectDetails/:projectId",passport.authenticate("level2", { session: false }),  adminController.fetchProjectDetails); 
router.get("/viewTicket",  adminController.viewTicket); 
router.get("/searchProject" , adminController.searchProject) ; 
router.get("/filterSubmit",passport.authenticate("level2", { session: false }),  adminController.filterSubmit );
router.patch("/updateProject/:projectId" ,passport.authenticate("level2", { session: false }) , adminController.updateProject ); 
router.get("/stats" , adminController.stats); 
router.get("/monthWiseAnalysis/:currentMonthValue" , adminController.monthWiseAnalysis) ; 

module.exports = router;
