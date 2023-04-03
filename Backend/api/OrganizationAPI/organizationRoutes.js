const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../middleware/passportVerify");
const organizationController = require("./organizationController");
router.get(
  "/fetchingUser",
  passport.authenticate("jwt", { session: false }),
  organizationController.fetchingUsers
);
router.post(
  "/registeringUsers",
  passport.authenticate("jwt", { session: false }),
  organizationController.registeringUsers
);
router.get("/searchUser",organizationController.searchUser ); 
router.patch("/updatingUser/:id", organizationController.updatingUser);
router.get("/stats" , organizationController.stats);
router.patch("/deleteUser" , organizationController.deleteUser);
router.patch("/activateUser" , organizationController.activateUser) ;   
module.exports = router;
