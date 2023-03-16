var project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var comments = require("../../model/commentsModel");
var task = require("../../model/taskModel");
var moment = require("moment"); 
const { default: mongoose } = require("mongoose");
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
        // res.status(202).send(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  res.status(202).send({ taskCreated: true });
};

var viewAssignedTask = function (req, res) {
  console.log(req.query.projectId);
  console.log(req.query.employeeId);

  task
    .find({
      "project.projectId": req.query.projectId,
      "user.userId": req.query.employeeId,
    })
    .then(function (ticketData) {
      res.status(202).send(ticketData);
    })
    .catch(function (error) {
      console.log(error);
    });
};
var showAllTask = function (req, res) {
  console.log(req.user._id);
  task
    .find({ "project.projectManager": req.user._id })
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var updateTask = function (req, res) {
  console.log(req.body);
  console.log(req.params); 
  task.findByIdAndUpdate(req.params.taskId ,req.body , {new:true}).then(function(response){
    res.status(200).send(response); 
  }).catch(function(error){
    console.log(error); 
  })
};
var dateWiseAnalysis = function(req,res){
  console.log(req.body); 

  task.aggregate([
    {$match :{$and :[
      {'project.projectManager':mongoose.Types.ObjectId('63f49bc544987940823b1f40')}  , 
      { createdAt: {
                  $gte:new Date(req.body.startDate), 
                  $lte:new Date(req.body.endDate) 
        }
      }
  ]}
},
  {$group: {_id : "$status"  ,  count:{$sum:1}}},

{
  $project:{
    status : "$_id",
    count:1,
    _id:0
  }
}
]).then(function(response){
  console.log(response); 
  res.status(200).send(response) ; 
}).catch(function(error){
  console.log(error); 
})


}
module.exports = {
  fetchingProjects,
  viewTicket,
  viewComments,
  addTasks,
  viewAssignedTask,
  showAllTask,
  updateTask,
  dateWiseAnalysis
};
