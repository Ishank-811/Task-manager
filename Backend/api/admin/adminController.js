const users = require("../../model/usersModel");
const project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var projectDetails = require("../../model/projectDetails");
const { aggregate } = require("../../model/projects");
var task = require("../../model/taskModel");
var mongoose = require("mongoose");
var adminPipeLine = require("./adminPipeline"); 
var organizationId, organizationName;

const fetchingUsers = function (req, res) {
  organizationId = req.user.organization.organizationId;
  organizationName = req.user.organization.name;

  users
    .find({
      $and: [
        { "organization.organizationId": req.user.organization.organizationId , isDeleted:false },
        { $or: [{ role: "Manager" }, { role: "Employee" }] },
        

      ],
    })
    .then(function (response) {
      res.status(202).json({ response, role: req.user.role });
    });
};

const creatingPorject = function (req, res) {
  var data = req.body;
  projectDetails
    .findOne({
      projectName: data.projectName,
      "organization.organizationId": organizationId,
      isDeleted:false
    })
    .then(function (projectExist) {
      if (projectExist) {
        return res.status(404).send("This Project Already Exist");
      } else {
        var response = new projectDetails({
          projectName: data.projectName,
          projectDescription:data.projectDescription,
          organization: { organizationId, name: organizationName },
          projectManger: data.projectManger,
          priority: data.priority,
          createdAt: data.createdAt,
          startDate: data.startDate,
          endDate: data.endDate,
          progress: { percentage: 0 },
        });
        response
          .save()
          .then(function (value) {
            for (var i = 0; i < data.assignedTo.length; i++) {
              var dataForProjectModel = new project({
                project: {
                  projectName: data.projectName,
                  projectId: value._id,
                },
                organization: { organizationId, name: organizationName },
                projectManger: data.projectManger,
                assignedTo:{
                  assignedUserId:data.assignedTo[i]._id, 
                  name:data.assignedTo[i].firstName,
                  username:data.assignedTo[i].username,
                  isStarted : false,
                },
                priority: data.priority,
                createdAt: data.createdAt,
                startDate: data.startDate,
                endDate: data.endDate,
              });
              dataForProjectModel
                .save()
                .then(function (res) {
                  console.log(res);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
            res.status(202).send(value);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
};

const fetchProjects = function (req, res) {
  const filters = {};
  // console.log(req.query);
  if (req.query.priority != "null") {
    filters.priority = req.query.priority;
  }
  if (req.query.createdStartDate != "null") {
    filters.createdAt = { $gte: new Date(req.query.createdStartDate) };
  }
  if (req.query.createdEndDate != "null") {
    filters.createdAt = {
      ...filters.createdAt,
      $lte: new Date(req.query.createdEndDate),
    };
  }
  if (req.query.startDate != "null") {
    filters.startDate = { $gte: new Date(req.query.startDate) };
  }
  if (req.query.endDate != "null") {
    filters.endDate = { $lte: new Date(req.query.endDate) };
  }

  var LIMIT = 8;
  var startIndex = (Number(req.query.currentPage) - 1) * 8;
  
  projectDetails
        .find({
          $and: [
            { "organization.organizationId": req.user.organization.organizationId , isDeleted:false},
            filters,
          ]
        })
        .sort({ _id: -1 })
        .limit(LIMIT)
        .skip(startIndex)
        .then(function (projectList) {
          projectDetails.countDocuments({$and: [
            { "organization.organizationId": req.user.organization.organizationId  , isDeleted:false},
            filters,
          ]}).then(function(projectCount){
            res.status(202).json({ projectList, projectCount });
          })
        
        })
        .catch(function (err) {
          res.status(404).send(err);
        });
};


const deleteuser = function (req, res) {
  mongoose.startSession().then(function (session) {
    session.startTransaction();
    Promise.all([
      project.updateMany(
        {
          "project.projectId": req.query.projectId,
          "assignedTo.assignedUserId": req.query.userId,
          isDeleted: false,
        },
        { isDeleted: true },
        { new: true }
      ),
      task.updateMany(
        {
          "project.projectId": req.query.projectId,
          "user.userId": req.query.userId,
          isDeleted: false,
        },
        { isDeleted: true },
        { new: true }
      ),
      ticket.updateOne(
        {
          "project.projectId": req.query.projectId,
          "user.userId": req.query.userId,
          isDeleted: false,
        },
        { isDeleted: true },
        { new: true }
      ),
    ])
      .then(function (response) {
        res.status(202).send(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (response) {
        res.status(202).send(response);
      })
      .catch(function (error) {
        session.abortTransaction();
        res.status(404).send(error);
      });
  });
};

var addEmployees = function (req, res) {
  var response = new project(req.body);
  response
    .save()
    .then(function (value) {
      res.status(202).send(value);
    })
    .catch(function (e) {
      console.log(e);
    });
};

const showEmployeeProjects = function (req, res) {
  var LIMIT = 5;
  var startIndex = (Number(req.query.currentPage) - 1) * 5;
  if (req.query.role == "Manager") {
    projectDetails
      .find({
        "organization.organizationId": req.query.organizationId,
        "projectManger.projectMangerId": req.query.employeeId,
        isDeleted:false
      })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .then(function (response) {
        projectDetails
          .find({
            "organization.organizationId": req.query.organizationId,
            "projectManger.projectMangerId": req.query.employeeId,
            isDeleted:false
          })
          .count()
          .then(function (count) {
            res.status(200).json({ projectData: response, count });
          });
      });
  } else {
    project
      .find({
        "organization.organizationId": req.query.organizationId,
        "assignedTo.assignedUserId": req.query.employeeId,
        isDeleted: false,
      })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .then(function (response) {
        project
          .find({
            "organization.organizationId": req.query.organizationId,
            "assignedTo.assignedUserId": req.query.employeeId,
            isDeleted:false
          })
          .count()
          .then(function (count) {
            res.status(200).json({ projectData: response, count });
          });
      });
  }
};

var fastestPaceProject = function (req, res) {

};
var fetchProjectDetails = function (req, res) {
  organizationId = req.user.organization.organizationId;
  projectDetails.findById(req.params.projectId).then(function (response) {
    if (response) {
      project
        .find({
          "organization.organizationId": organizationId,
          "project.projectId": req.params.projectId,
          isDeleted: false,
        })
        .then(function (usersData) {
          res.status(200).send({ usersData, projectData: response });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
};

const viewTicket = function (req, res) {
  ticket
    .findOne({
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

var searchProject = function (req, res) {
  var data = req.query;
  var regex = new RegExp(data.projectName, "i");
  projectDetails
    .find({ projectName: regex , isDeleted:false })
    .then(function (response) {
      console.log(response);
      res.status(200).send(response);
    })
    .catch(function (error) {
      res.status(404).send(error);
    });
};


var updateProject = function (req, res) {
  var updatedProject = req.body;
  var projectUpdateObject = {
    project: {
      projectName: updatedProject.projectName,
      projectId: req.params.projectId,
    },
    priority: updatedProject.priority,
  };
  if (updatedProject.startDate != undefined) {
    projectUpdateObject.startDate = updatedProject.startDate;
  }
  if (updatedProject.endDate != undefined) {
    projectUpdateObject.endDate = updatedProject.endDate;
  }
  console.log(projectUpdateObject);
  var updateFunction = function () {
    mongoose.startSession().then(function (session) {
      session.startTransaction();
      Promise.all([
        projectDetails.findByIdAndUpdate(req.params.projectId, updatedProject, {
          new: true,
        }),
        project.updateMany(
          { "project.projectId": req.params.projectId },
          projectUpdateObject,
          { new: true }
        ),
        task.updateMany(
          { "project.projectId": req.params.projectId },
          { "project.ProjectName": updatedProject.projectName },
          { new: true }
        ),
        ticket.updateMany(
          { "project.projectId": req.params.projectId },
          { "project.ProjectName": updatedProject.projectName },
          { new: true }
        ),
      ])
        .then(function (response) {
          res.status(200).send(response);
        })
        .catch(function (error) {
          session.abortTransaction();
          res.status(404).send(error);
        });
    });
  };
  projectDetails
    .findById(req.params.projectId)
    .then(function (response) {
      if (response.projectName != updatedProject.projectName) {
        projectDetails
          .findOne({ projectName: updatedProject.projectName , isDeleted:false })
          .then(function (response) {
            if (response) {
              res.status(204).json({ data: "Project Already Present" });
            } else {
              updateFunction();
            }
          });
      } else {
        updateFunction();
      }
    })
    .catch(function (error) {
      res.status(404).send(error);
    });
};

var stats = function (req, res) {
  var organizationId = (req.user.organization.organizationId); 
  Promise.all([
    project.aggregate(adminPipeLine.perUserProject(organizationId)),
    task.aggregate(adminPipeLine.top3Employees(organizationId)),
    projectDetails.aggregate(adminPipeLine.fastestPaceProject(organizationId)),
    projectDetails.aggregate(adminPipeLine.projectStatusNumber(organizationId)),
    projectDetails.aggregate(adminPipeLine.isUpcoming(organizationId)),
    projectDetails.aggregate(adminPipeLine.overDueProjects(organizationId)),
  ]).then(function (response) {
    res.status(200).json({
      perUserProject: response[0],
      top3Employees: response[1],
      fastestPaceProject: response[2],
      projectStatusNumber: response[3],
      isUpcoming: response[4],
      overDueProjects: response[5],
    });
  });
};


var monthWiseAnalysis = function(req,res){
  var currentMonth = req.params.currentMonthValue ; 
  var nextMonth = (parseInt(currentMonth)+1).toString().padStart(currentMonth.length, '0'); 
  projectDetails.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date("2023-"+currentMonth+"-01"),
          $lt: new Date("2023-"+nextMonth+"-01"),
        },
        isDeleted:false
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        day: "$_id",
        count: 1,
      },
    },
  ]).then(function(response){
    res.status(200).send(response); 
  }).catch(function(error){
    res.stauts(404).send(error); 
  })
}


var projectWiseAnalysis = function(req,res){

var currentMonth = req.query.monthValue ; 
var nextMonth = (parseInt(currentMonth)+1).toString().padStart(currentMonth.length, '0'); 
Promise.all([
  task.aggregate([{
    $match: {
      "project.projectId": mongoose.Types.ObjectId(req.query.projectId),
      isDeleted:false,
      createdAt: {
        $gte: new Date("2023-"+currentMonth+"-01"),
        $lt: new Date("2023-"+nextMonth+"-01"),
      },
    },
  },
  {
    $group: {
      _id: { day: { $dayOfMonth: "$createdAt" } },
      numberOfTaskCreated: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      numberOfTaskCreated: 1,
      day: "$_id.day",
    },
  },
  {
    $sort: { day: 1 },
  },
]),
task.aggregate([
  {
    $match: {
      "project.projectId": mongoose.Types.ObjectId(req.query.projectId),
      "isCompleted.status": true,
      isDeleted:false,
      "isCompleted.updatedAt": {
        $gte: new Date("2023-"+currentMonth+"-01"),
        $lt: new Date("2023-"+nextMonth+"-01"),
      },
    },
  },
  {
    $group: {
      _id: { day: { $dayOfMonth: "$isCompleted.updatedAt" } },
      numberOfTaskCompleted: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      numberOfTaskCompleted: 1,
      day: "$_id.day",
    },
  },
  {
    $sort: { day: 1 },
  },
])
]).then(function(response){
  res.status(200).json({
    numberOfTaskCreated:response[0],
    numberOfTaskCompleted:response[1]
  })
}).catch(function(error){
  res.status(404).send(error); 
})

}


const deleteProject = function(req,res){
mongoose.startSession().then(function (session) {
  session.startTransaction();
Promise.all([
  projectDetails.updateMany({_id:mongoose.Types.ObjectId(req.params.projectId)} , {isDeleted:true}, {new:true}),
  project.updateMany({'project.projectId':mongoose.Types.ObjectId(req.params.projectId)} , {isDeleted:true}, {new:true}), 
  task.updateMany({'project.projectId':mongoose.Types.ObjectId(req.params.projectId)}, {isDeleted:true} , {new:true}),
  ticket.updateMany({'project.projectId':mongoose.Types.ObjectId(req.params.projectId)}, {isDeleted:true} , {new:true}),
]).then(function(response){
  res.status(200).send(response);  
}).catch(function(error){
  session.abortTransaction();
res.stauts(404).send(error);  
}) 
})
}


module.exports = {
  stats,
  fetchingUsers,
  creatingPorject,
  fetchProjects,
  deleteuser,
  addEmployees,
  showEmployeeProjects,
  fastestPaceProject,
  fetchProjectDetails,
  viewTicket,
  searchProject,
  monthWiseAnalysis,
  updateProject,
  projectWiseAnalysis,
  deleteProject,
  
};
