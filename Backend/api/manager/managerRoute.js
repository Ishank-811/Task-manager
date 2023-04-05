const express = require("express");
const router = express.Router();
const passport = require("passport");
const managerController = require("./managerController");

router.post(
  "/fetchingProjects",
  passport.authenticate("level2", { session: false }),
  managerController.fetchingProjects
);



router.get(
  "/viewComments/:ticketId",
  managerController.viewComments
);
router.post("/addTasks" , passport.authenticate("level2", { session: false }),
managerController.addTasks)

router.get("/viewAssignedTask" , managerController.viewAssignedTask); 
router.patch("/updateTask/:taskId" , managerController.updateTask); 
router.post("/dateWiseAnalysis" , managerController.dateWiseAnalysis) ;  
router.get("/fetchProjectDetail/:projectId" , managerController.fetchProjectDetail) ;  
router.get("/showAllAssignedProjects",passport.authenticate("level2", { session: false }),
 managerController.showAllAssignedProjects);
 router.get("/showProjectTask/:projectId",passport.authenticate("level2", { session: false }), managerController.showProjectTask); 
router.get("/searchProject" , managerController.searchProject); 
router.patch("/deleteTask/:taskId",  managerController.deleteTask)  ; 
router.patch("/projectStatusUpdate/:projectId" , managerController.projectStatusUpdate) ; 
router.get("/stats" ,passport.authenticate("level2", { session: false }),managerController.stats); 
router.get("/projectTaskStats/:projectId" , managerController.projectTaskStats); 
router.get("/userStats/:userId" , managerController.userStats) ;
router.get("/searchEmployee/:name" ,  managerController.searchEmployee) ;  

 module.exports = router;
