const express = require("express");
const router = express.Router();
const passport = require("passport");
const managerController = require("./managerController");

router.get(
  "/fetchingProjects",
  passport.authenticate("level2", { session: false }),
  managerController.fetchingProjects
);

router.get(
  "/viewTicket/:projectId",
  passport.authenticate("level2", { session: false }),
  managerController.viewTicket
);

router.get(
  "/viewComments/:ticketId",
  managerController.viewComments
);
router.post("/addTasks" , passport.authenticate("level2", { session: false }),
managerController.addTasks)

router.get("/viewAssignedTask" , managerController.viewAssignedTask); 

module.exports = router;
