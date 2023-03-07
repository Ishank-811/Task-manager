var project = require("../../model/projects");
var comments = require("../../model/commentsModel");
var ticket = require("../../model/ticketModel");
const fs = require("fs");
const util = require("util");
const unlinkfile = util.promisify(fs.unlink);
const { uploadFile } = require("../../s3");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
// console.log(upload);
var fetchingProjects = function (req, res) {
  project
    .aggregate([
      {
        $match: {
          "organization.organizationId": req.user.organization.organizationId,
        },
        $match: {
          "assignedTo.assignedUserId": req.user._id,
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

var addTicket = function (req, res) {
  console.log(req.body.projectName);
  project
    .findOneAndUpdate(
      { _id: req.body.projectId },
      { $set: { "assignedTo.$[el].isStarted": true } },
      {
        arrayFilters: [{ "el.assignedUserId": req.user._id }],
        new: true,
      }
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log(req.body);
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
  });
  console.log(response);
  response
    .save()
    .then(function () {
      res.json({employeeId:req.user._id});
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
  // console.log(req.params);
  // console.log(req.body);
  console.log(req.user);

  var response = new comments({
    ticketId: req.body.ticketId,
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
  ticket
    .findByIdAndUpdate(
      req.params.ticketId,
      { status: req.body.projectStatus },
      { new: true }
    )
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var uploadFileToUrl = async (req, res) => {
  console.log(req.file);
  console.log(req.user);
  console.log(req.params);

  const result = await uploadFile(req.file);
  await unlinkfile(req.file.path);
  console.log(result);
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

module.exports = {
  fetchingProjects,
  addTicket,
  viewTicket,
  addComment,
  updatingStatus,
  uploadFileToUrl,
};
