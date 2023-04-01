var fac = function ($http) {
  return {
    readingdata: function (currentPage,sortedFormObject ,filter, token, cb) {
      console.log(sortedFormObject); 
     
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      var data = {}
      if(filter!=undefined){
        data.filter=filter ;  
      }
     
      
      if(sortedFormObject==undefined){
        sortedFormObject = {id:undefined}; 
      }
      
      $http.post(`http://localhost:8080/employee/fetchingProjects?currentPage=${currentPage}&sortBy=${sortedFormObject._id}`,data, config).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    addTicket: function (ticketDetails,token, cb) {
      console.log(ticketDetails); 
      var data= {
        _id:ticketDetails._id , 
        projectId:ticketDetails.project.projectId,
        projectManagerId: ticketDetails.projectManger.projectMangerId,
        projectName: ticketDetails.project.projectName,
        projectManagerUsername: ticketDetails.projectManger.username,
        projectManagerName: ticketDetails.projectManger.name,
        createdAt: new Date(),
        priority: ticketDetails.priority,
      }
      $http({
        method: "POST",
        url: "http://localhost:8080/employee/addTicket",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json",
        },
        data,
      })
        .then(function (res) {
          console.log(res);
          cb(res);
        })
        .catch(function (err) {
          // console.log(err);
        });
    },
    viewTicket: function (projectId , token, cb) {
    
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(
          `http://localhost:8080/employee/viewTicket/${projectId}`,
          config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res.data);
          },
          function (err) {
            return err;
          }
        );
    },
    addComment: function (comments ,ticketId , token, cb) {
      var data = {
        comments
      }
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .patch(
          `http://localhost:8080/employee/addComment/${ticketId}`,
          data,
          config
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
    updatingStatus: function (progressBarStore,projectId , projectStatus,ticketId,token,  cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      var data = {
        projectStatus,
        ticketId,
      
        progressBarDiff:100-progressBarStore,
        projectId
      };
      $http
        .patch(
          `http://localhost:8080/employee/updatingStatus/${data.ticketId}`,
          data , config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res.data.status);
          },
          function (err) {
            return err;
          }
        );
    },
    viewComments: function (ticketId, cb) {
     
      $http
        .get(`http://localhost:8080/manager/viewComments/${ticketId}`)
        .then(
          function (res) {
            console.log(res);
            cb(res.data);
          },
          function (err) {
            return err;
          }
        );
    },
    uploadFileToUrl: function (formData , ticketId ,token, cb) {
      $http({
        method: "PATCH",
        url: `http://localhost:8080/employee/uploadFileToUrl/${ticketId}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": undefined,
        },
        data: formData,
      })
        .then(function (res) {
          console.log(res);
          cb(res);
        })
        .catch(function (err) {
          // console.log(err);
        });
    },
    updateProgress: function (progressBar , progressBarStore,ticketId, projectId,  cb) {
      var data = {
        progressBar:progressBar,
        progressBarDiff:progressBar -progressBarStore,
        projectId
      };
      $http
        .patch(
          `http://localhost:8080/employee/updateProgress/${ticketId}`,
          data
        )
        .then(
          function (res) {
            console.log(res);
            cb(res.data.progress.percentage);
          },
          function (err) {
            return err;
          }
        );
    },
    viewAssignedTask : function(projectId, token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get(`http://localhost:8080/employee/viewAssignedTask?projectId=${projectId}`, config).then(
        function (res) {
          console.log(res);
          cb(res.data);
        },
        function (err) {
          return err;
        }
      ); 
      
    },
    taskStatusUpdate : function(taskStatus,taskId , cb){
      var data = {
        taskStatus,
      };
      $http
      .patch(
        `http://localhost:8080/employee/taskStatusUpdate/${taskId}`,
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
    getAllTasks: function(token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get("http://localhost:8080/employee/getAllTickets", config).then(
        function (res) {
          console.log(res);
          cb(res.data);
        },
        function (err) {
          return err;
        }
      ); 
    },
    employeeStatistics:function(currentMonthValue , token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get(`http://localhost:8080/employee/employeeStatistics/${currentMonthValue}`, config).then(
        function (res) {
          console.log(res);
          cb(res.data);
        },
        function (err) {
          return err;
        }
      );  
    },
    employeeStats: function(token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get("http://localhost:8080/employee/employeeStats", config).then(
        function (res) {
          console.log(res);
          cb(res.data.countTheProjects , res.data.upcomingProjects , res.data.overdueProjects);
        },
        function (err) {
          return err;
        }
      );  
    },
    progressProject: function(token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get("http://localhost:8080/employee/progressProject", config).then(
        function (res) {
          console.log(res);
          cb(res.data);
        },
        function (err) {
          return err;
        }
      ); 
    }
  };
};

myApp.factory("employeeServices", fac);
