const express = require("express");
const router = express.Router();
const singupController = require("./singupController");
router.post("/registerAsorganization", singupController.registerAsorganization);
module.exports = router;
