var project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var comments = require("../../model/commentsModel");

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

module.exports = { fetchingProjects, viewTicket, viewComments };
