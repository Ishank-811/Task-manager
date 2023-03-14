const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("./adminController");
require("../../middleware/passportVerify");
router.get(
  "/fetchingUsers",
  passport.authenticate("level2", { session: false   }),
  adminController.fetchingUsers
);
router.post("/creatingProject", adminController.creatingPorject);
router.get(
  "/fetchProjects",
  passport.authenticate("level2", { session: false }),
  adminController.fetchProjects
);
router.get("/getProjectDetails/:id", adminController.getProjectDetails);
router.post("/deleteuser", adminController.deleteuser);
router.post("/addEmployees", adminController.addEmployees);
router.get("/viewProfile", adminController.viewProfile);
router.get("/showEmployeeTicket" , adminController.showEmployeeTicket); 
// router.patch("/updatingUser/:id" ,organizationController.updatingUser )

module.exports = router;
