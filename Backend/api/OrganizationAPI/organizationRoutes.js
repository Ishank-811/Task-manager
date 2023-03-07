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
router.patch("/updatingUser/:id", organizationController.updatingUser);

module.exports = router;
