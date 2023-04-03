var project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var comments = require("../../model/commentsModel");
var users = require("../../model/usersModel"); 
var task = require("../../model/taskModel");
var ProjectDetails = require("../../model/projectDetails");
var managerPipeLine = require("./managerPipeline"); 
var moment = require("moment");
const { default: mongoose } = require("mongoose");

var fetchingProjects = function (req, res) {
  var LIMIT = 8;
  var startIndex = (Number(req.query.currentPage) - 1) * 8;
  project
    .aggregate([
      {
        $match: {
          "organization.organizationId": req.user.organization.organizationId,
        },
        $match: {
          "projectManger.projectMangerId": req.user._id,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$project.projectId",
          createdAt: { $first: "$createdAt" },
          endDate: { $first: "$endDate" },
          projectManger: { $first: "$projectManger" },
          projectName: { $first: "$project.projectName" },
          documents: {
            $push: {
              assignedTo: "$assignedTo",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          projectName: 1,
          projectManger: 1,
          documents: 1,
          endDate: 1,
          createdAt: 1,
        },
      },
    ])
    .sort({ _id: -1 })
    .skip(startIndex)
    .limit(LIMIT)
    .then(function (projectDetails) {
      ProjectDetails.find({ "projectManger.projectMangerId": req.user._id })
        .count()
        .then(function (countNum) {
          res
            .status(202)
            .json({ projectDetails, userid: req.user._id, countNum });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

var viewComments = function (req, res) {
  comments
    .find({ 'ticket.ticketId': req.params.ticketId })
    .then(function (response) {
      console.log(response);
      res.status(202).send(response);
    })
    .catch(function (err) {
      console.log(err);
    });
};

var addTasks = function (req, res) {
  console.log(req.user);
  console.log(req.body);
  for (var i = 0; i < req.body.taskeEmployeesAssigned.length; i++) {
    var data = {
      organization: {
        organizationId: req.user.organization.organizationId,
        name: req.user.organization.name,
      },
      user: {
        userId: req.body.taskeEmployeesAssigned[i].assignedUserId,
        name: req.body.taskeEmployeesAssigned[i].name,
        username: req.body.taskeEmployeesAssigned[i].username,
      },
      task: {
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
      },
      project: req.body.project,
      createdAt: new Date(),
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };
    var response = new task(data);
    response
      .save()
      .then(function (response) {
        console.log(response);
        res.status(202).send(response);
        // res.status(202).send(response);
      })
      .catch(function (error) {
        // console.log(error);
      });
  }
};

var viewAssignedTask = function (req, res) {
  console.log(req.query.projectId);
  console.log(req.query.employeeId);

  task
    .find({
      "project.projectId": req.query.projectId,
      "user.userId": req.query.employeeId,
      isDeleted: false,
    })
    .then(function (ticketData) {
      res.status(202).send(ticketData);
    })
    .catch(function (error) {
      console.log(error);
    });
};
var managerUserId;

var updateTask = function (req, res) {
  console.log(req.body);
  console.log(req.params);
  task
    .findByIdAndUpdate(req.params.taskId, req.body, { new: true })
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
var dateWiseAnalysis = function (req, res) {
  console.log(req.body);

  task
    .aggregate([
      {
        $match: {
          $and: [
            {
              "project.projectManager": mongoose.Types.ObjectId(managerUserId),
            },
            {
              createdAt: {
                $gte: new Date(req.body.startDate),
                $lte: new Date(req.body.endDate),
              },
            },
          ],
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },

      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ])
    .then(function (response) {
      console.log(response);
      res.status(200).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var fetchProjectDetail = function (req, res) {
  ProjectDetails.findById(req.params.projectId)
    .then(function (projectData) {
      ticket
        .find({ "project.projectId": req.params.projectId ,  isDeleted:false })
        .then(function (ticketsData) {
          res.status(200).send({ projectData, ticketsData });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

var showAllAssignedProjects = function (req, res) {
  var LIMIT = 8;
  var startIndex = (Number(req.query.currentPage) - 1) * 8;
  ProjectDetails.find({ "projectManger.projectMangerId": req.user._id })
    .sort({ _id: -1 })
    .skip(startIndex)
    .limit(LIMIT)
    .then(function (response) {
      ProjectDetails.find({ "projectManger.projectMangerId": req.user._id })
        .count()
        .then(function (countNum) {
          res.status(200).send({ projectData: response, countNum });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};
var showProjectTask = function (req, res) {
  task
    .find({
      "organization.organizationId": req.user.organization.organizationId,
      "project.projectId": req.params.projectId,
      isDeleted: false,
    })
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var searchProject = function (req, res) {
  console.log(req.query);

  var regex = new RegExp(req.query.projectName, "i");
  project
    .aggregate([
      {
        $match: {
          "projectManger.projectMangerId": req.query.managerId,
        },
        $match: {
          "project.projectName": regex,
        },
      },
      {
        $group: {
          _id: "$project.projectId",
          createdAt: { $first: "$createdAt" },
          endDate: { $first: "$endDate" },
          projectManger: { $first: "$projectManger" },
          projectName: { $first: "$project.projectName" },
          documents: {
            $push: {
              assignedTo: "$assignedTo",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          projectName: 1,
          projectManger: 1,
          documents: 1,
          endDate: 1,
          createdAt: 1,
        },
      },
    ])
    .then(function (projectDetails) {
      res.status(200).send(projectDetails);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var deleteTask = function (req, res) {
  console.log(req.params);

  task
    .findByIdAndUpdate(req.params.taskId, { isDeleted: true }, { new: true })
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var projectStatusUpdate = function(req,res){
  var data  ={
    status:req.body.status
  }
  if(req.body.status=='completed'){
    var completed ={
      status:true, 
      updatedAt:new Date()
    }
    data.isCompleted = completed; 
  }

  ProjectDetails.findByIdAndUpdate(req.params.projectId,  data , {new:true}).then(function(response){
    res.status(202).send(response); 
  }).catch(function(error){
    res.status(404).send(error); 
  })
}

var projectManagerId; 
var stats=  function(req,res){
  projectManagerId = req.user._id; 
  Promise.all([
    task.aggregate(managerPipeLine.countBystatus(projectManagerId)),
    ProjectDetails.aggregate(managerPipeLine.isUpcomingProject(projectManagerId)),
    ProjectDetails.aggregate(managerPipeLine.overDueProject(projectManagerId)),
    task.aggregate(managerPipeLine.completionRateOfProject(projectManagerId)),
    task.aggregate(managerPipeLine.taskCreatedDayWise(projectManagerId)),
  ])

.then(function(response){
  res.status(202).json({
    countBystatus: response[0],
    isUpcomingProject:response[1],
    overDueProject:response[2],
    completionRateOfProject : response[3], 
    taskCreatedDayWise : response[4], 
  }); 
 }).catch(function(error){
  res.status(400).send(error); 
 })
}


var projectTaskStats = function(req,res){
  task.aggregate([
    
    { $match: { 
      "project.projectId": mongoose.Types.ObjectId(req.params.projectId) , isDeleted:false} },
    {
      $group: {
        _id: "$user.userId",
        name : {$first:'$user.name' },
        totalTasksAssigned: { $sum: 1 },
        inactiveTasks: {
          $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] }
        },
        workingTasks: {
          $sum: { $cond: [{ $eq: ["$status", "working"] }, 1, 0] }
        },
        tasksCompleted: {
          $sum: { $cond: [{ $eq: ["$isCompleted.status", true] }, 1, 0] },
        },
      },
    },
    {
      $project:{
        _id:0, 
        name:1,
        totalTasksAssigned:1,
        tasksCompleted:1,
        inactiveTasks:1, 
        workingTasks:1, 
        tasksCompleted:1
      }
    }

  ])
  .then(function(response){
    res.status(200).send(response); 
  }).catch(function(error){
    res.status(404).send(error); 
  })  
}


var userStats = function(req,res){
  task.aggregate([
      {
        $match: {
          "user.userId": mongoose.Types.ObjectId(req.params.userId),
          isDeleted: false,
        }
      },
      {
        $group: {
          _id: "$project.projectId",
          projectName: { $first: "$project.ProjectName" },
          taskCount: { $sum: 1 },
        },
      },
    ]).then(function(response){
      res.status(200).send(response); 
    }).catch(function(error){
      res.status(404).send(error); 
    })
}

var searchEmployee=  function(req,res){
  var regex = new RegExp(req.params.name, "i");
  users.find({username:regex , role:'Employee' , isDeleted:false}).then(function(response){
    res.status(200).send(response); 
  }).catch(function(error){
    res.status(404).send(error); 
  })
}

module.exports = {
  fetchingProjects,
  viewComments, 
  addTasks,
  viewAssignedTask,
  updateTask,
  dateWiseAnalysis,
  fetchProjectDetail,
  showAllAssignedProjects,
  showProjectTask,
  searchProject,
  deleteTask,
  projectStatusUpdate,
  stats,
  projectTaskStats,
  userStats,
  searchEmployee
};
