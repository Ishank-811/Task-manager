const ProjectDetails = require("../../model/projectDetails");
const projects = require("../../model/projects");
const users = require("../../model/usersModel");
const task = require("../../model/taskModel");
const tickets = require("../../model/ticketModel");
const comments = require("../../model/commentsModel");
const { default: mongoose } = require("mongoose");

const registeringUsers = function (req, res) {
  console.log(req.body);

  console.log(req.user) ; 
  users
    .findOne({
      "organization.organizationId": req.user.organization.organizationId,
      username: req.body.email,
      isDeleted:false ,   
    })
    .then(function (userdetail) {
      if (userdetail) {
        res.status(404).send("Employee already exist");
      } else {
        var response = new users({
          organization: {
            name:req.user.organization.name,
            organizationId: req.user.organization.organizationId,
          },
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.email,
          password: req.body.password,
          role: req.body.role,
        });
        response
          .save()
          .then(function () {
            res.status(202).send(response);
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

const fetchingUsers = function (req, res) {
  var LIMIT = 8;
  var startIndex = (Number(req.query.currentPage) - 1) * 8;
    var filter = {
      "organization.organizationId": req.user.organization.organizationId,
      role: {$in: ["Employee", "Manager"], $ne: "Admin"}
    };
    if (req.query.filterEmployee != "null") {
      filter.role = req.query.filterEmployee;
    }

    var id = req.user.organization.organizationId;
    users
      .find(filter)
      .skip(startIndex)
      .limit(LIMIT)
      .then(function (data) {
        users.countDocuments(filter).then(function (countNum) {
          res
            .status(202)
            .json({
              usersdata: data,
              roleAsOrganization: true,
              validity: true,
              adminId: id,
              countNum,
            });
        });
      })
      .catch(function (e) {
        console.log(e);
      });
  
};

const updatingUser = function (req, res) {
var updateFunction = function(){
if(req.body.role=="Employee"){
mongoose.startSession().then(function(session){
  session.startTransaction();
  Promise.all([
    projects.updateMany(
      { "assignedTo.assignedUserId": req.params.id },
      {
        "assignedTo.name": req.body.firstName,
        "assignedTo.username": req.body.username,
      },
      { new: true }
    ),
    task.updateMany(
      { "user.userId": req.params.id },
      { "user.name": req.body.firstName, "user.username": req.body.username },
      { new: true }
    ),
    tickets.updateMany(
      { "user.userId": req.params.id },
      { "user.name": req.body.firstName, "user.username": req.body.username },
      { new: true }
    ),
    users.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    ),
  ]).then(function (response) {
    res.status(200).send(response);
  })
  .catch(function (error) {
    session.abortTransaction();
    res.status(404).send(error);
  });
})
} else if(req.body.role=='Manager'){
  mongoose.startSession().then(function(session){
    session.startTransaction();
    Promise.all([
      projects.updateMany(
        { "projectManger.projectMangerId": req.params.id },
        {
          "projectManger.name": req.body.firstName,
          "projectManger.username": req.body.username,
        },
        { new: true }
      ),
      task.updateMany(
        { "project.projectManager": req.params.id },
        { "project.projectManagerName": req.body.firstName, "project.projectManagerUsername": req.body.username },
        { new: true }
      ),
      tickets.updateMany(
        { "project.projectManager": req.params.id },
        { "project.projectManagerName": req.body.firstName, "project.projectManagerUsername": req.body.username },
        { new: true }
      ),
      ProjectDetails.updateMany(
        {"projectManger.projectMangerId": req.params.id},
        {
          "projectManger.name": req.body.firstName,
          "projectManger.username": req.body.username,
        },
        { new: true }
        ),
      users.findByIdAndUpdate(
        req.params.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: req.body.password,
        },
        { new: true }
      ),
    ]).then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      session.abortTransaction();
      res.status(404).send(error);
    });
  })
}else{
  users.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
    },
    { new: true }
  ).then(function(response){
    res.status(200).send(response)
  }).catch(function(error){
    res.status(404).send(error); 
  })
}
}

users
.findById(req.params.id)
.then(function (response) {
  if (response.username != req.body.username) {
    users
      .findOne({ username: req.body.username ,isDeleted:false })
      .then(function (response) {
      
        if (response) {
          res.status(204).json({ data: "User Already Present" });
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

const searchUser = function (req, res) {
  const regex = new RegExp(req.query.value, "i");
  users
    .find({ "organization.organizationId": req.query.adminId, username: regex })
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var stats = function(req,res){
  Promise.all([
  users.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 }
      }
    }
  ]),
  ProjectDetails.aggregate([
    {
      $group: {
        _id: "$projectManger.projectMangerId",
        managerName: { $first: "$projectManger.name" },
        projectsCount: { $sum: 1 },
        projectCompleted: {
          $sum: { $cond: [{ $eq: ["$isCompleted.status", true] }, 1, 0] },
        },
        totalCompletionTime: {
          $sum: {
            $cond: {
              if: { $eq: [ "$isCompleted.status", true ] },
              then: { $subtract: [ "$isCompleted.updatedAt", "$createdAt" ] },
              else: 0
            }
          }
        },
      }
    },
    {
      $sort: { projectsCount: -1 }
    },
    {
      $limit: 2
    },
    {
      $project: {
        _id: 0,
        managerName: 1,
        projectsCount: 1,
        projectCompleted:1, 
        avgCompletionTime: { $divide: [ "$totalCompletionTime", "$projectsCount" ] }
      }
    },
  ]),
      task.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: "$user.userId",
          name: { $first: "$user.name" },
          tasksCompleted: {
            $sum: { $cond: [{ $eq: ["$isCompleted.status", true] }, 1, 0] },
          },
          tasksAssigned: { $sum: 1 },
          totalTime: {
            $sum: {
              $cond: [
                { $eq: ["$isCompleted.status", true] },
                { $subtract: ["$isCompleted.updatedAt", "$createdAt"] },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          tasksCompleted: 1,
          tasksAssigned: 1,
          completionRate: { $divide: ["$tasksCompleted", "$tasksAssigned"] },
          averageTime: {
            $cond: [
              { $gt: ["$tasksCompleted", 0] },
              { $divide: ["$totalTime", "$tasksCompleted"] },
              0,
            ],
          },
        },
      },
      {
        $sort: { completionRate: -1, averageTime: 1 },
      },
      {
        $limit: 3,
      },
    ]),
]).then(function(response){
  res.status(200).json({
    numOfRole:response[0],
    top2Manager:response[1], 
    top3Employee:response[2]
  })
})
}

const deleteUser=  function(req,res){
users.findByIdAndUpdate(req.query.employeeId , {isDeleted:true},  {new:true}).then(function(response){
  res.status(202).send(response)
}).catch(function(error){
  res.status(400).send(error); 
})

}

var activateUser = function(req,res){
  users.findByIdAndUpdate(req.query.employeeId , {isDeleted:false},  {new:true}).then(function(response){
    res.status(202).send(response)
  }).catch(function(error){
    res.status(400).send(error); 
  })
  
}

module.exports = { registeringUsers, fetchingUsers, updatingUser, searchUser , stats , deleteUser, activateUser };
