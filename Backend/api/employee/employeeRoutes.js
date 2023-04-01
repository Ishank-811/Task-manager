const express = require("express");
const router = express.Router();
const passport = require("passport");
const employeeController = require("./employeeController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post(
  "/fetchingProjects",
  passport.authenticate("level2", { session: false }),
  employeeController.fetchingProjects
);
router.post(
  "/addTicket",
  passport.authenticate("level2", { session: false }),
  employeeController.addTicket
);
router.get(
  "/viewTicket/:projectId",
  passport.authenticate("level2", { session: false }),
  employeeController.viewTicket
);
router.patch(
  "/addComment/:ticketId",
  passport.authenticate("level2", { session: false }),
  employeeController.addComment
);

router.patch(
  "/updatingStatus/:ticketId",
  passport.authenticate("level2", { session: false }),
  employeeController.updatingStatus
);

router.patch(
  "/uploadFileToUrl/:ticketId",
  passport.authenticate("level2", { session: false }),
  upload.single("file"),
  employeeController.uploadFileToUrl
);

router.patch("/updateProgress/:ticketId", employeeController.updateProgress);
router.get(
  "/viewAssignedTask",
  passport.authenticate("level2", { session: false }),
  employeeController.viewAssignedTask
);

router.patch("/taskStatusUpdate/:taskId", employeeController.taskStatusUpdate);
router.get(
  "/getAllTickets",
  passport.authenticate("level2", { session: false }),
  employeeController.getAllTickets
);
router.get(
  "/employeeStatistics/:currentMonthValue",
  passport.authenticate("level2", { session: false }),
  employeeController.employeeStatistics
);
router.get(
  "/employeeStats",
  passport.authenticate("level2", { session: false }),
  employeeController.employeeStats
);
router.get(
  "/progressProject",
  passport.authenticate("level2", { session: false }),
  employeeController.progressProject
);
module.exports = router;
