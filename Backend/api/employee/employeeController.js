var project = require("../../model/projects");
var ProjectDetails = require("../../model/projectDetails");
var comments = require("../../model/commentsModel");
var ticket = require("../../model/ticketModel");
var task = require("../../model/taskModel");
const fs = require("fs");
const util = require("util");
var mongodb = require("mongodb");
const unlinkfile = util.promisify(fs.unlink);
const { uploadFile } = require("../../s3");
const multer = require("multer");
var employeePipeline  = require("./employeePipelines"); 
const { default: mongoose } = require("mongoose");

const upload = multer({ dest: "uploads/" });

var fetchingProjects = function (req, res) {
  var filter = {
    "assignedTo.assignedUserId": req.user._id,
    isDeleted: false,
  };
  if (req.body != {}) {
    if (req.body.filter == "OverDue") {
      filter.endDate = { $lt: new Date() };
    } else if (req.body.filter == "Upcoming") {
      filter.endDate = { $gt: new Date() };
    }
  }
  console.log(filter);
  var LIMIT = 5;
  var startIndex = (Number(req.query.currentPage) - 1) * 5;
  var sortBy = req.query.sortBy;
  project
    .find(filter)
    .sort(sortBy != "undefined" ? { _id: sortBy } : { _id: -1 })
    .limit(LIMIT)
    .skip(startIndex)
    .then(function (projectDetails) {
      project.countDocuments(filter).then(function (countNum) {
        res.status(200).json({ projectDetails, countNum });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

var addTicket = function (req, res) {
  project
    .findByIdAndUpdate(
      req.body._id,
      { "assignedTo.isStarted": true },
      { new: true }
    )
    .then(function () {
      var response = new ticket({
        organization: {
          organizationId: req.user.organization.organizationId,
          name: req.user.organization.name,
        },
        user: {
          userId: req.user._id,
          name: req.user.firstName,
          username: req.user.username,
        },
        project: {
          ProjectName: req.body.projectName,
          projectId: req.body.projectId,
          projectManager: req.body.projectManagerId,
          projectManagerUsername: req.body.projectManagerUsername,
          projectManagerName: req.body.projectManagerName,
        },
        createdAt: req.body.createdAt,
        priority: req.body.priority,
        progress: {
          percentage: 0,
          UpdatedAt: new Date(),
        },
      });

      response
        .save()
        .then(function () {
          res.json({ employeeId: req.user._id });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const viewTicket = function (req, res) {
  ticket
    .findOne({
      "project.projectId": req.params.projectId,
      "user.userId": req.user._id,
    })
    .then(function (ticketData) {
      res.status(202).send(ticketData);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const addComment = function (req, res) {
  var response = new comments({
    ticketId: req.params.ticketId,

    comments: {
      comment: req.body.comments,
      commentBy: {
        role: req.user.role,
        name: req.user.firstName,
        username: req.user.username,
      },
    },
  });
  response
    .save()
    .then(function () {
      res.status(202).send(response);
    })
    .catch(function (e) {
      console.log(e);
    });
};

var updatingStatus = function (req, res) {

  var data = {
    status: req.body.projectStatus,
  };
  if(req.body.projectStatus=='completed'){
    var progress= {
      percentage:100,
      UpdatedAt: new Date() 
    }
    data.progress=progress;
  }

  if (req.body.projectStatus == "complete") {
    ProjectDetails.findByIdAndUpdate(req.body.projectId, {
      $inc: { "progress.percentage": req.body.progressBarDiff },
      "progress.UpdatedAt": new Date(),
    })
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  }
  ticket
    .findByIdAndUpdate(req.params.ticketId, data, { new: true })
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var uploadFileToUrl = async (req, res) => {
  const result = await uploadFile(req.file);
  await unlinkfile(req.file.path);

  var response = new comments({
    ticketId: req.params.ticketId,
    comments: {
      file: result.Location,
      commentBy: {
        role: req.user.role,
        name: req.user.firstName,
        username: req.user.username,
      },
    },
  });
  response
    .save()
    .then(function () {
      res.status(202).send(response);
    })
    .catch(function (e) {
      console.log(e);
    });
};

const updateProgress = function (req, res) {
  var data = {
    "progress.percentage": req.body.progressBar,
    "progress.UpdatedAt": new Date(),
    status: "inProgress",
  };
  if (req.body.progressBar == 100) {
    data.status = "completed";
  }
  ticket
    .findByIdAndUpdate(req.params.ticketId, data, { new: true })
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  ProjectDetails.findByIdAndUpdate(req.body.projectId, {
    $inc: { "progress.percentage": req.body.progressBarDiff },
    "progress.UpdatedAt": new Date(),
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var viewAssignedTask = function (req, res) {
  task
    .find({
      "project.projectId": req.query.projectId,
      "user.userId": new mongodb.ObjectId(req.user._id),
      isDeleted: false,
    })
    .then(function (ticketData) {
      res.status(202).send(ticketData);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var taskStatusUpdate = function (req, res) {
  var data = {
    status: req.body.taskStatus,
  };
  if (req.body.taskStatus == "completed") {
    var completed = {
      status: true,
      updatedAt: new Date(),
    };
    data.isCompleted = completed;
  }
  task
    .findByIdAndUpdate(req.params.taskId, data, { new: true })
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var getAllTickets = function (req, res) {
  task
    .find({ "user.userId": req.user._id, isDeleted: false })
    .sort({ _id: -1 })
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      res.status(404).send(error);
    });
};

var employeeStatistics = function (req, res) {
  var currentMonth = req.params.currentMonthValue;
  var nextMonth = (parseInt(currentMonth) + 1)
    .toString()
    .padStart(currentMonth.length, "0");
  task
    .aggregate([
      {
        $match: {
          "user.userId": mongoose.Types.ObjectId(req.user._id),
          "isCompleted.status": true,
          isDeleted: false,
          createdAt: {
            $gte: new Date("2023-" + currentMonth + "-01"),
            $lt: new Date("2023-" + nextMonth + "-01"),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$isCompleted.updatedAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      res.status(404).send(error);
    });
};

var employeeStats = function (req, res) {
  var employeeId = (req.user._id);
  Promise.all([
    project.aggregate(employeePipeline.countTheProjects(employeeId)),
    project.aggregate(employeePipeline.upcomingProjects(employeeId)),
    project.aggregate(employeePipeline.overdueProjects(employeeId)),
  ]).then(function (response) {
    res.status(200).json({
      countTheProjects: response[0],
      upcomingProjects: response[1],
      overdueProjects: response[2],
    });
  });
};

var progressProject = function (req, res) {
  ticket
    .aggregate([
      {
        $match: {
          isDeleted: false,
          "user.userId": mongoose.Types.ObjectId(req.user._id),
          createdAt: {
            $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: "$project.projectId",
          projectName: { $first: "$project.ProjectName" },
          progress: {
            $avg: "$progress.percentage",
          },
        },
      },
      {
        $sort: {
          progress: -1,
        },
      },
    ])
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      res.status(404).send(error);
    });
};

module.exports = {
  fetchingProjects,
  addTicket,
  viewTicket,
  addComment,
  updatingStatus,
  uploadFileToUrl,
  updateProgress,
  viewAssignedTask,
  taskStatusUpdate,
  getAllTickets,
  employeeStatistics,
  employeeStats,
  progressProject,
};
