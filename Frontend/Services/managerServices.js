var fac = function ($http) {
  var data = JSON.parse(localStorage.getItem("myData")) || {};
  return {
    getData: function () {
      return data;
    },
    setData: function (newData) {
      data = newData;
      localStorage.setItem("myData", JSON.stringify(data));
    },

    readingdata: function (data, filterObject, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      var data = {
        currentPage: data.currentPage,
        filterObject,
      };
      
      $http
        .post(`http://localhost:8080/manager/fetchingProjects`, data, config)
        .then(function (res) {
          cb(res.data.countNum , res.data.projectDetails);
        }),
        function (err) {
          return err;
        };
    },

    addTasks: function (taskDetails, projectDetails, token, cb) {
      var data = {
        taskName: taskDetails.taskName,
        taskDescription: taskDetails.taskDescription,
        taskeEmployeesAssigned: taskDetails.taskeEmployeesAssigned,
        startDate: taskDetails.startDate,
        project: {
          projectId: projectDetails._id,
          ProjectName: projectDetails.projectName,
          projectManager: projectDetails.projectManger.projectMangerId,
          projectManagerUsername: projectDetails.projectManger.username,
          projectManagerName: projectDetails.projectManger.name,
        },
        endDate: taskDetails.endDate,
      };

      $http({
        method: "POST",
        url: "http://localhost:8080/manager/addTasks",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json",
        },
        data,
      }).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    viewAssignedTask: function (userId, projectId, cb) {
      var data = {
        userId,
        projectId,
      };
      $http
        .get(
          `http://localhost:8080/manager/viewAssignedTask?projectId=${data.projectId}&employeeId=${data.userId}`
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

    updateTask: function (updateTask, cb) {
      var data = {
        task: {
          taskName: updateTask.updatedTaskName,
          taskDescription: updateTask.updatedTaskDescription,
        },
      };
      if (updateTask.updatedStartDate != undefined) {
        data.startDate = updateTask.updatedStartDate;
      }
      if (updateTask.updatedEndDate != undefined) {
        data.endDate = updateTask.updatedEndDate;
      }

      $http
        .patch(
          `http://localhost:8080/manager/updateTask/${updateTask.taskId}`,
          data
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
    dateWiseAnalysis: function (data, cb) {
      $http.post("http://localhost:8080/manager/dateWiseAnalysis", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    fetchProjectDetail: function (data, totalEmployees, cb) {
      $http
        .get(`http://localhost:8080/manager/fetchProjectDetail/${data}`, data)
        .then(
          function (res) {
            console.log(res);
            var storingArray = [];
            var employeesAsignedFiltered = [];
            storingArray = res.data.ticketsData.map(function (element) {
              return element.user.userId;
            });
            employeesAsignedFiltered = totalEmployees.filter(function (
              element
            ) {
              return !storingArray.includes(element.assignedTo.assignedUserId);
            });
            var progressPercentage = (
              res.data.projectData.progress.percentage / totalEmployees.length
            ).toFixed(1);
            cb(
              employeesAsignedFiltered,
              res.data.projectData,
              res.data.ticketsData,
              progressPercentage
            );
          },
          function (err) {
            return err;
          }
        );
    },
    showAllAssignedProjects: function (currentPage, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http
        .get(
          `http://localhost:8080/manager/showAllAssignedProjects?currentPage=${currentPage}`,
          config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res.data.projectData , res.data.countNum);
          },
          function (err) {
            return err;
          }
        );
    },
    showProjectTask: function (projectId, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(
          `http://localhost:8080/manager/showProjectTask/${projectId}`,
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

    searchProject: function (projectName, managerId, cb) {
      $http
        .get(
          `http://localhost:8080/manager/searchProject?projectName=${projectName}&managerId=${managerId}`
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
    deleteTask: function (taskId, cb) {
      $http.patch(`http://localhost:8080/manager/deleteTask/${taskId}`).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    projectStatusUpdate: function (status, projectId, cb) {
      var data = {
        status,
      };
      $http
        .patch(
          `http://localhost:8080/manager/projectStatusUpdate/${projectId}`,
          data
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
      $http.get("http://localhost:8080/manager/stats/", config).then(
        function (res) {
          console.log(res);
          var dates = [];
          var createdData = [];
          for (var i = 0; i < 31; i++) {
            createdData.push(0);
            dates.push(i);
          }
          res.data.taskCreatedDayWise.forEach(function (element) {
            createdData.splice(element.day, 1, element.count);
          });
          var projectName = res.data.completionRateOfProject.map(function (
            element
          ) {
            return element.projectName;
          });
          var avgCompletionTime = res.data.completionRateOfProject.map(
            function (element) {
              return element.avgCompletionTime / (1000 * 60 * 60);
            }
          );
          cb(
            res.data.countBystatus,
            res.data.isUpcomingProject,
            res.data.overDueProject,
            (completionRateOfProject = {
              projectName,
              avgCompletionTime,
            }),
            (taskCreatedDayWise = {
              dates,
              createdData,
            })
          );
        },
        function (err) {
          return err;
        }
      );
    },
    projectTaskStats: function (projectId, cb) {
      $http
        .get(`http://localhost:8080/manager/projectTaskStats/${projectId}`)
        .then(
          function (response) {
            var users = response.data.map(function (element) {
              return element.name;
            });
            var completedTask = response.data.map(function (element) {
              return element.tasksCompleted;
            });
            var workingTasks = response.data.map(function (element) {
              return element.workingTasks;
            });
            var inactiveTasks = response.data.map(function (element) {
              return element.inactiveTasks;
            });
            var totalTasks = response.data.map(function (element) {
              return element.totalTasksAssigned;
            });

            cb(
              (projectTaskStats = {
                users,
                completedTask,
                workingTasks,
                inactiveTasks,
                totalTasks,
              })
            );
          },
          function (err) {
            return err;
          }
        );
    },
    searchEmployee: function (searchEmployee, cb) {
      $http
        .get(`http://localhost:8080/manager/searchEmployee/${searchEmployee}`)
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
    userStats: function (userId, cb) {
      $http.get(`http://localhost:8080/manager/userStats/${userId}`).then(
        function (response) {
          var projectNameLabel = response.data.map(function (element) {
            return element.projectName;
          });
          var numberOfTaskData = response.data.map(function (element) {
            return element.taskCount;
          });
          cb(
            (userStats = {
              projectNameLabel,
              numberOfTaskData,
            })
          );
        },
        function (err) {
          return err;
        }
      );
    },
  };
};

myApp.service("managerServices", fac);
