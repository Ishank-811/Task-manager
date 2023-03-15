var project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var comments = require("../../model/commentsModel");
var task = require("../../model/taskModel");
var fetchingProjects = function (req, res) {
  project
    .aggregate([
      {
        $match: {
          "organization.organizationId": req.user.organization.organizationId,
        },
        $match: {
          "projectManger.projectMangerId": req.user._id,
        },
      },
    ])
    .then(function (projectDetails) {
      res.status(202).json({ projectDetails, userid: req.user._id });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const viewTicket = function (req, res) {
  ticket
    .find({
      $and: [
        {
          "project.projectId": req.params.projectId,
          "project.projectManager": req.user._id,
        },
      ],
    })
    .then(function (ticketDetails) {
      res.status(202).json({ ticketDetails, userid: req.user._id });
    })
    .catch(function (error) {
      console.log(error);
    });
};

var viewComments = function (req, res) {
  console.log(req.params);
  comments
    .find({ ticketId: req.params.ticketId })
    .then(function (response) {
      console.log(response);
      res.status(202).send(response);
    })
    .catch(function (err) {
      console.log(err);
    });
};

var addTasks = function(req,res){
console.log(req.user); 
console.log(req.body); 
for(var i=0 ; i<req.body.taskeEmployeesAssigned.length ; i++){ 
  var data  = {
    organization: {
      organizationId: req.user.organization.organizationId,
      name: req.user.organization.name,
    },
    user: {
      userId: req.body.taskeEmployeesAssigned[i].assignedUserId,
      name: req.body.taskeEmployeesAssigned[i].name,
      username: req.body.taskeEmployeesAssigned[i].username,
    },
    task:{
      taskName:req.body.taskName,
      taskDescription:req.body.taskDescription 
    },
    project:req.body.project,
    createdAt:new Date() , 
    startDate : req.body.startDate , 
    endDate : req.body.endDate
  }
  var response = new task(data); 
  response.save().then(function(response){
    console.log(response); 
    // res.status(202).send(response); 
  }).catch(function(error){
    console.log(error); 
  }) 
}
res.status(202).send({taskCreated:true}); 
}

var viewAssignedTask  = function(req,res){
  console.log(req.query.projectId);
  console.log(req.query.employeeId);    

  task
  .find({
    "project.projectId": req.query.projectId,
    "user.userId":req.query.employeeId,
  })
  .then(function (ticketData) {
    res.status(202).send(ticketData);
  })
  .catch(function (error) {
    console.log(error);
  });

}


module.exports = { fetchingProjects, viewTicket, viewComments , addTasks,  viewAssignedTask };
