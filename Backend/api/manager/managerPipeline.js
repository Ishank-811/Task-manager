var countBystatus = function(managerId){
    return [
        {
          $match :{isDeleted:false , 
            'project.projectManager':managerId
        }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]
}

var isUpcomingProject = function(managerId){
    return [
        { $match: { "isCompleted.status": false , isDeleted:false,
        'projectManger.projectMangerId':managerId},
      },
        {
          $project: {
            projectName: 1,
            startDate: 1,
            endDate: 1,
            priority:1 , 
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
var overDueProject =  function(managerId){
    return [
        { $match: { "isCompleted.status": false , isDeleted:false,
        'projectManger.projectMangerId':managerId },
       
       
    },
        {
          $project: {
            projectName: 1,
            startDate: 1,
            endDate: 1,
            priority:1 ,
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
var completionRateOfProject=  function(managerId){
return [
    {
      $match: {
        "isDeleted": false,
        "isCompleted.status": true,
        'project.projectManager':managerId
      }
    },
    {
      $group: {
        _id: "$project.projectId",
        projectName: {
          $first: "$project.ProjectName"
        },
        numTasks: {
          $sum: 1
        },
        totalCompletionTime: {
          $sum: {
            $subtract: ["$isCompleted.updatedAt", "$createdAt"]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        projectName: 1,
        avgCompletionTime: {
          $divide: ["$totalCompletionTime", "$numTasks"]
        }
      }
    },
    {
      $sort: {
        avgCompletionTime: -1
      }
    },
    {
      $limit: 5
    }
   ]
}
var taskCreatedDayWise = function(managerId){
    return [
        {
          $match: {
            createdAt: {
              $gte: new Date("2023-03-01"),
              $lt: new Date("2023-04-01"),
            },
            'project.projectManager':managerId
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
      ]
}
module.exports= {countBystatus , isUpcomingProject  ,overDueProject, completionRateOfProject , taskCreatedDayWise}; 