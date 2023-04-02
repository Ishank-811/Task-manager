var countTheProjects = function(employeeId){

return [
    {
      $match: {
        isDeleted: false,
        "assignedTo.assignedUserId": employeeId,
      },
    },
    {
      $group: {
        _id: "$assignedTo.isStarted",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        isStarted: "$_id",
        count: 1,
      },
    },
  ]
}

var upcomingProjects =  function(employeeId){
return [
    {
      $match: {
        isDeleted: false,
        "assignedTo.assignedUserId":employeeId,
      },
    },
    {
      $project: {
        "project.projectName": 1,
        "assignedTo.isStarted": 1,
        "project.projectId": 1,
        startDate: 1,
        endDate: 1,
        priority: 1,
        isUpcoming: {
          $gt: ["$endDate", new Date()],
        },
      },
    },
    {
      $match: {
        isUpcoming: true,
      },
    },
    { $sort: { endDate: 1 } },
    { $limit: 5 },
  ]
}

var overdueProjects = function(employeeId){
return [
    {
      $match: {
        isDeleted: false,
        "assignedTo.assignedUserId": employeeId,
      },
    },
    {
      $project: {
        "project.projectName": 1,
        "assignedTo.isStarted": 1,
        "project.projectId": 1,
        projectName: 1,
        startDate: 1,
        endDate: 1,
        priority: 1,
        isOverdue: {
          $lt: ["$endDate", new Date()],
        },
      },
    },
    {
      $match: {
        isOverdue: true,
      },
    },
    { $sort: { endDate: 1 } },
    { $limit: 5 },
  ]
}
module.exports= {countTheProjects , upcomingProjects ,overdueProjects}