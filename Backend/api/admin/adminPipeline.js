var top3Employees = function(){
   return [{
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
  }]
}
var projectStatusNumber= function(){
    [
        {
          $match: { endDate: { $gte: new Date() } },
        },
        {
          $project: {
            progress: 1,
            projectName: 1,
            pace: {
              pace: {
                $divide: [
                  "$progress.percentage",
                  {
                    $divide: [
                      { $subtract: ["$progress.UpdatedAt", "$startDate"] },
                      86400000,
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $sort: { pace: -1 },
        },
        {
          $limit: 5,
        },
      ]
}
var projectStatusNumber = function(){
return [
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]
}

var isUpcoming = function(){
    return [
        { $match: { "isCompleted.status": false } },
        {
          $project: {
            projectName: 1,
            startDate: 1,
            endDate: 1,
            'projectManger.name':1,
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
var overDueProjects = function(){
    return [
        { $match: { "isCompleted.status": false } },
        {
          $project: {
            projectName: 1,
            startDate: 1,
            endDate: 1,
            'projectManger.name':1,
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

var fastestPaceProject = function(){
    return [
        {
          $match: { endDate: { $gte: new Date() } },
        },
        {
          $project: {
            progress: 1,
            projectName: 1,
            pace: {
              pace: {
                $divide: [
                  "$progress.percentage",
                  {
                    $divide: [
                      { $subtract: ["$progress.UpdatedAt", "$startDate"] },
                      86400000,
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $sort: { pace: -1 },
        },
        {
          $limit: 5,
        },
      ]
}

var perUserProject=  function(){
   return [
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: "$assignedTo.assignedUserId",
            name: { $first: "$assignedTo.name" },
            username: { $first: "$assignedTo.username" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        {
          $limit: 5,
        },
      ]
    }

module.exports = {top3Employees , projectStatusNumber , isUpcoming , overDueProjects , fastestPaceProject , perUserProject} ; 