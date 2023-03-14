const express = require("express");
const router = express.Router();
const passport = require("passport");
const employeeController = require("./employeeController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.get(
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

router.patch("/updatingStatus/:ticketId", employeeController.updatingStatus);

router.patch(
  "/uploadFileToUrl/:ticketId",
  passport.authenticate("level2", { session: false }),
  upload.single("file"),
  employeeController.uploadFileToUrl
);

router.patch("/updateProgress/:ticketId" ,employeeController.updateProgress );  


module.exports = router;
