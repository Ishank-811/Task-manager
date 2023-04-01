  var fac = function ($http) {
    var data = JSON.parse(localStorage.getItem('myData')) || {};
  return {

    getData: function() {
      return data;
    },
    setData: function(newData) {
      data = newData;
      localStorage.setItem('myData', JSON.stringify(data));
    },

    readingdata: function (data, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(`http://localhost:8080/manager/fetchingProjects?currentPage=${data.currentPage}`, config)
        .then(function (res) {
          console.log(res);
          cb(res);
        }),
        function (err) {
          return err;
        };
    },
    
    
    addTasks : function(taskDetails ,projectDetails,token , cb){

      var data = {
        taskName:taskDetails.taskName,
        taskDescription:taskDetails.taskDescription,
        taskeEmployeesAssigned:taskDetails.taskeEmployeesAssigned,
        startDate:taskDetails.startDate,
        project: {
            projectId: projectDetails._id ,
            ProjectName:  projectDetails.projectName,
            projectManager:  projectDetails.projectManger.projectMangerId, 
            projectManagerUsername:  projectDetails.projectManger.username,
            projectManagerName: projectDetails.projectManger.name,
          },
        endDate:taskDetails.endDate
      }

      $http({
        method: "POST",
        url: "http://localhost:8080/manager/addTasks",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json",
        },
        data,
      })
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            return err;
          }
        );
    },
    viewAssignedTask : function(userId,projectId,  cb){
      var data= {
        userId,
        projectId
      }
      $http
      .get(
        `http://localhost:8080/manager/viewAssignedTask?projectId=${data.projectId}&employeeId=${data.userId}`
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    
    updateTask : function( updateTask , cb){

      var data=  {
        task:{
          taskName: updateTask.updatedTaskName,
          taskDescription: updateTask.updatedTaskDescription,
        }        
      }
      if (updateTask.StartDateValue != undefined) {
          data.startDate = updateTask.StartDateValue; 
      }
      if (updateTask.EndDateValue != undefined) {
          data.endDate = updateTask.EndDateValue ; 
      }

      $http
      .patch(
        `http://localhost:8080/manager/updateTask/${updateTask.taskId}`,
        data,
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    },
    dateWiseAnalysis : function(data , cb){
      $http
      .post(
        "http://localhost:8080/manager/dateWiseAnalysis"  ,data
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    }
    ,fetchProjectDetail : function(data , cb){
      $http
      .get(
        `http://localhost:8080/manager/fetchProjectDetail/${data}`  ,data
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    },
    showAllAssignedProjects : function(currentPage , token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http
      .get(
        `http://localhost:8080/manager/showAllAssignedProjects?currentPage=${currentPage}`  ,config
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    },
    showProjectTask:function(projectId, token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
      .get(
        `http://localhost:8080/manager/showProjectTask/${projectId}`  ,config
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    },

    searchProject:function (projectName,managerId, cb) {
      $http
        .get(
          `http://localhost:8080/manager/searchProject?projectName=${projectName}&managerId=${managerId}`
        )
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            return err;
          }
        );
    },
    deleteTask:function(taskId , cb){
      $http
      .patch(
        `http://localhost:8080/manager/deleteTask/${taskId}`
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    }, 
    projectStatusUpdate : function(status , projectId  ,cb){
      var data = {
        status,
      };
      $http
      .patch(
        `http://localhost:8080/manager/projectStatusUpdate/${projectId}`, data
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );  
    },
   statistics : function(cb){
    $http
      .get(
        "http://localhost:8080/manager/stats/", 
      )
      .then(
        function (res) {
          console.log(res);
          cb(res.data.countBystatus,  res.data.isUpcomingProject  , res.data.overDueProject ,
             res.data.completionRateOfProject, res.data.taskCreatedDayWise );
        },
        function (err) {
          return err;
        }
      );  
   },
   projectTaskStats  :function(projectId , cb){
    $http
    .get(
      `http://localhost:8080/manager/projectTaskStats/${projectId}`, 
    )
    .then(
      function (res) {
        console.log(res);
        cb(res);
      },
      function (err) {
        return err;
      }
    );  
   }
   ,
   searchEmployee :function(searchEmployee , cb){
    $http
    .get(
      `http://localhost:8080/manager/searchEmployee/${searchEmployee}`, 
    )
    .then(
      function (res) {
        console.log(res);
        cb(res);
      },
      function (err) {
        return err;
      }
    );  
   },
   userStats:function(userId , cb){
    $http
    .get(
      `http://localhost:8080/manager/userStats/${userId}`, 
    )
    .then(
      function (res) {
        console.log(res);
        cb(res);
      },
      function (err) {
        return err;
      }
    );
   }

  };
};

myApp.factory("managerServices", fac);
