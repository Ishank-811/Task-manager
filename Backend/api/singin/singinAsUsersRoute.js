//this route is made because we have to use passportjs local strategy for two different models
const express = require("express");
const router = express.Router();
const passport = require("passport");
const singinController = require("./singinController");
var passs = require("../../middleware/passportSiginAsUser");
passs.initialize(passport);
router.post(
  "/",
  passport.authenticate("level1", { session: false }),
  singinController.singinAsUsers
);
module.exports = router;
