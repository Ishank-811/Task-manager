const users = require("../../model/usersModel");
const project = require("../../model/projects");
var ticket = require("../../model/ticketModel");
var organizationId, organizationName;

const fetchingUsers = function (req, res) {
  organizationId = req.user.organization.organizationId;
  organizationName = req.user.organization.name;
  Promise.all([
    users
    .find({
      $and: [
        { "organization.organizationId": req.user.organization.organizationId },
        { $or: [{ role: "Manager" }, { role: "Employee" }] },
      ],
    }),
    project.find({}).count(),
  ]).then(function(response){
    
    res.status(202).json({ response, role: req.user.role});
  })

};

const creatingPorject = function (req, res) {
  project
    .findOne({
      projectName: req.body.projectName,
      "organization.organizationId": organizationId,
    })
    .then(function (projectdetail) {
      if (projectdetail) {
        return res.status(404).send("This Project Already Exist");
      } else {
        var response = new project({
          projectName: req.body.projectName,
          organization: { organizationId, name: organizationName },
          projectManger: req.body.projectManger,
          assignedTo: req.body.assignedTo,
          priority: req.body.priority,
          createdAt: req.body.createdAt,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          progress : {percentage:0}
        });
        response
          .save()
          .then(function () {
            res.send(response);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    })
    .catch(function (e) {
      console.log(e);
    });
};

const fetchProjects = function (req, res) {
  var LIMIT = 8 ;  
  var startIndex  = (Number(req.query.currentPage)-1)*8; 
  project
    .find({
      "organization.organizationId": req.user.organization.organizationId,
    }).sort({_id:-1}).limit(LIMIT).skip(startIndex) 
    .then(function (projectDetails) {
      res.status(202).send(projectDetails);
    })
    .catch(function (err) {
      res.status(404).send(err);
    });
};

const getProjectDetails = function (req, res) {
  project
    .findById(req.params.id, "assignedTo projectManger projectName")
    .then(function (projectDetails) {
      res.status(202).send(projectDetails);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const deleteuser = function (req, res) {
  console.log(req.body);
  project
    .findByIdAndUpdate(
      req.body.projectId,
      { $pull: { assignedTo: { assignedUserId: req.body.userId } } },
      { new: true }
    )
    .then(function (response) {
      console.log(response);
      res.status(202).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var addEmployees = function (req, res) {
  console.log(req.body);
  var assignedData = {
    assignedUserId: req.body.userDetails._id,
    name: req.body.userDetails.firstName,
    username: req.body.userDetails.username,
    isStarted: false,
  };
  project
    .findByIdAndUpdate(
      req.body.projectId,
      { $push: { assignedTo: assignedData } },
      { new: true }
    )
    .then(function (response) {
      res.status(202).send(response);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const viewProfile = function (req, res) {
  users
    .findById(req.query.userId)
    .then(function (response) {
      res.status(202).send(response);
    })
    .catch(function (error) {
      res.status(404).send("unable to fetch the employee");
      console.log(error);
    });
};

const showEmployeeTicket = function (req, res) {
  console.log(req.query);
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

module.exports = {
  fetchingUsers,
  creatingPorject,
  fetchProjects,
  getProjectDetails,
  deleteuser,
  addEmployees,
  viewProfile,
  showEmployeeTicket,
};
