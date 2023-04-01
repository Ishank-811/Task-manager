var fac = function ($http) {
  return {
    readingData: function (token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http.get("http://localhost:8080/admin/fetchingUsers", config).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          cb(err);
          return err;
        }
      );
    },
    creatingPorject: function (projectDetails, projectManger, cb) {
      var data = {
        projectName: projectDetails.projectName,
        projectManger,
        assignedTo: projectDetails.assignedTo,
        priority: projectDetails.priority,
        createdAt: new Date(),
        startDate: projectDetails.startDate,
        endDate: projectDetails.endDate,
      };

      $http.post("http://localhost:8080/admin/creatingProject", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          cb(err);
          return err;
        }
      );
    },
    fetchProjects: function (data, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(
          `http://localhost:8080/admin/fetchProjects?currentPage=${data.currentPage}`,
          config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            // cb(err);
            return err;
          }
        );
    },
    fetchProjectDetails: function (data, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(`http://localhost:8080/admin/fetchProjectDetails/${data}`, config)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (error) {
            console.log(error);
          }
        );
    },
    showEmployeeProjects: function (employeeId, organizationId,currentPage, role, cb) {
      var data = {
        employeeId,
        organizationId,
        currentPage,
        role,
      };
      $http
        .get(
          `http://localhost:8080/admin/showEmployeeProjects?organizationId=${data.organizationId}&employeeId=${data.employeeId}&role=${data.role}&currentPage=${data.currentPage}`
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
    fastestPaceProject: function (cb) {
      $http.get("http://localhost:8080/admin/fastestPaceProject").then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    viewTicket: function (projectId, employeeId, cb) {
      $http
        .get(
          `http://localhost:8080/admin/viewTicket/?projectId=${projectId}&employeeId=${employeeId}`
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
    searchProject: function (projectName, cb) {
      $http
        .get(
          `http://localhost:8080/admin/searchProject/?projectName=${projectName}`
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
    filterSubmit: function (filterObject, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      console.log(filterObject);
      $http
        .get(
          `http://localhost:8080/admin/filterSubmit/?priority=${filterObject.priorityFilter}&createdStartDate=${filterObject.createdStartDateFilter}&createdEndDate=${filterObject.createdEndDateFilter}&startDate=${filterObject.startDateFilter}&endDate=${filterObject.endDateFilter}`,
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
    updateProject : function(updatedProjectData  ,projectId, token , cb){

      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      var data = {
      projectName:updatedProjectData.projectName,
      priority:updatedProjectData.priority,
      }
      if(updatedProjectData.startDate!=undefined){
        data.startDate = updatedProjectData.startDate; 
      }
      if(updatedProjectData.endDate!=undefined){
        data.endDate = updatedProjectData.endDate; 
      }
      $http
        .patch(
          `http://localhost:8080/admin/updateProject/${projectId}`,
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
    deleteuser: function (projectId , userId, cb) {
      $http.patch(`http://localhost:8080/admin/deleteuser?projectId=${projectId}&userId=${userId}`).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    statistics: function(token , cb){
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(
          "http://localhost:8080/admin/stats",
          config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res.data.perUserProject , res.data.top3Employees , 
              res.data.fastestPaceProject , res.data.projectStatusNumber ,  res.data.isUpcoming , res.data.overDueProjects);
          },
          function (err) {
            return err;
          }
        ); 
    } , 
    monthWiseAnalysis : function(currentMonthValue , cb){
      $http
      .get(
        `http://localhost:8080/admin/monthWiseAnalysis/${currentMonthValue}`
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
    }
  };
};

myApp.factory("adminServices", fac);
