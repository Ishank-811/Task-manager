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
          cb(res.data.response , res.data.role);
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
        projectDescription: projectDetails.projectDescription,
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
    fetchProjects: function (filterObject, data, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      console.log(filterObject);
      $http
        .get(
          `http://localhost:8080/admin/fetchProjects?currentPage=${data.currentPage}&priority=${filterObject.priorityFilter}&createdStartDate=${filterObject.createdStartDateFilter}&createdEndDate=${filterObject.createdEndDateFilter}&startDate=${filterObject.startDateFilter}&endDate=${filterObject.endDateFilter}`,
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
            var storingArray=[]; 
            storingArray = res.data.usersData.map(function (element) {
              return element.assignedTo.assignedUserId;
            });
            cb(res.data.usersData , res.data.projectData , storingArray);
          },
          function (error) {
            console.log(error);
          }
        );
    },
    showEmployeeProjects: function (
      employeeId,
      organizationId,
      currentPage,
      role,
      cb
    ) {
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
            cb(res.data);
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
            cb(res.data);
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

    updateProject: function (updatedProjectData, projectId, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      var data = {
        projectName: updatedProjectData.projectName,
        priority: updatedProjectData.priority,
      };
      if (updatedProjectData.startDate != undefined) {
        data.startDate = updatedProjectData.startDate;
      }
      if (updatedProjectData.endDate != undefined) {
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
    deleteuser: function (projectId, userId, cb) {
      $http
        .patch(
          `http://localhost:8080/admin/deleteuser?projectId=${projectId}&userId=${userId}`
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
    statistics: function (token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http.get("http://localhost:8080/admin/stats", config).then(
        function (res) {
          console.log(res);
          var projectName =  res.data.fastestPaceProject.map((element) => {
            return element.projectName;
          });
          var projectPace =  res.data.fastestPaceProject.map((element) => {
            return element.pace.pace;
          });

          var workloadedEmployees = res.data.perUserProject.map((element) => {
            return element.name;
          });
          var workloadedEmployeesCount = res.data.perUserProject.map((element) => {
            return element.count;
          });
          

          cb(
            perUserProject={
              workloadedEmployees, workloadedEmployeesCount
            },
            res.data.top3Employees,
            fastestPaceProject={
              projectName, 
              projectPace
            },
            res.data.projectStatusNumber,
            res.data.isUpcoming,
            res.data.overDueProjects
          );
        },
        function (err) {
          return err;
        }
      );
    },
    monthWiseAnalysis: function (currentMonthValue, cb) {
      $http
        .get(
          `http://localhost:8080/admin/monthWiseAnalysis/${currentMonthValue}`
        )
        .then(
          function (res) {
            console.log(res);
            var dates = [];
          var data = [];
       
          var monthNumber = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

          for (var i = 0; i <= monthNumber[currentMonthValue - 1]; i++) {
            data.push(0);
            dates.push(i);
          }

          res.data.forEach(function (element) {
            data.splice(element.day, 1, element.count);
          });
            cb(projectCreatedDayWise={
              dates , data
            });
          },
          function (err) {
            return err;
          }
        );
    },
    addEmployees: function (projectDetails , userDetails, cb) {
      var data=  {
      project:{projectName:projectDetails.projectName ,  projectId:projectDetails._id},
      organization:projectDetails.organization,
      projectManger:projectDetails.projectManger,
      assignedTo : {
        assignedUserId:userDetails._id ,
        name:userDetails.firstName,
        username:userDetails.username,
        isisStarted:false
      }, priority: projectDetails.priority,
      createdAt:new Date(),
      startDate: projectDetails.startDate,
      endDate: projectDetails.endDate,
      }
      $http.post("http://localhost:8080/admin/addEmployees", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    projectWiseAnalysis: function (projectId, monthValue,monthNum, cb) {
      console.log(projectId, monthValue);
      $http
        .get(
          `http://localhost:8080/admin/projectWiseAnalysis?projectId=${projectId}&monthValue=${monthValue}`
        )
        .then(
          function (res) {
         
            var ProjectWisedates = [];
            var ProjectWiseData = [];
            var monthNumber = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (var i = 0; i <= monthNumber[monthNum - 1]; i++) {
              ProjectWiseData.push(0);
              ProjectWisedates.push(i);
            }
  
            var CreatedProjectWiseData = [];
            for (var i = 0; i <= 31; i++) {
              CreatedProjectWiseData.push(0);
            }
            res.data.numberOfTaskCreated.forEach(function (element) {
              ProjectWiseData.splice(
                element.day,
                1,
                element.numberOfTaskCreated
              );
             
            });
            res.data.numberOfTaskCompleted.forEach(function (element) {
              CreatedProjectWiseData.splice(
                element.day,
                1,
                element.numberOfTaskCompleted
              );
            });

            cb(projectWiseAnalysisObject={
              ProjectWiseData,ProjectWisedates , CreatedProjectWiseData
            });
          },
          function (err) {
            return err;
          }
        );
    },
    deleteProject:function(projectId , cb){
      $http.patch(`http://localhost:8080/admin/deleteProject/${projectId}`).then(
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

myApp.service("adminServices", fac);
