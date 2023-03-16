myApp.controller(
  "mangerController",
  function ($scope, $window, $timeout, managerServices, employeeServices) {
    var role = sessionStorage.getItem("role");
    var token = sessionStorage.getItem("token");
    $scope.message = "Manager Dashboard";

    if (role == "Manager") {
      $scope.hideticket = true;
      $scope.showManagerDashboard = false;
      $scope.ViewTicketLoader = true;

      $window.location.href = "#!/MangerDashboard";
      managerServices.readingdata(token, function (data) {
        $scope.response = data.data.projectDetails;
      });
      $scope.getTickets = function (val) {
        var data = {
          projectId: val._id,
          token,
        };
        $scope.ticket = "";
        $scope.noTickets = false;
        $scope.ViewTicketLoader = false;
        $scope.employeeWithNoTicked = [];
        managerServices.viewTicket(data, function (response) {
          console.log(response.data.ticketDetails);
          if (response.data.ticketDetails.length == 0) {
            $scope.ViewTicketLoader = true;
            $scope.noTickets = true;
            $scope.hideticket = true;
          } else {
            $scope.ViewTicketLoader = true;
            $scope.noTickets = false;
            $scope.hideticket = false;
            $scope.ticket = response.data.ticketDetails;

            var inactiveNumber = 0;
            var completedNumber = 0;
            var progressNumber = 0;
            var startedNumber = 0;
            $scope.ticket.forEach((element) => {
              // console.log(element.status) ;
              if (element.status == "Inactive") {
                inactiveNumber++;
                console.log(inactiveNumber);
              } else if (element.status == "completed") {
                completedNumber++;
              } else if (element.status == "inProgress") {
                progressNumber++;
              } else if (element.status == "started") {
                startedNumber++;
              }
            });
            $timeout(function () {
              new Chart("pie-chart", {
                type: "pie",
                data: {
                  labels: ["Progress", "Completed", "Not Started", "Started"],
                  datasets: [
                    {
                      label: "Population (millions)",
                      backgroundColor: [
                        "#5bf556",
                        "#ffc107",
                        "#dc3545",
                        "#6610f2",
                      ],
                      data: [
                        progressNumber,
                        completedNumber,
                        inactiveNumber,
                        startedNumber,
                      ],
                    },
                  ],
                },
                options: {
                  title: {
                    display: true,
                    text: "Predicted world population (millions) in 2050",
                  },
                },
              });
            }, 0);
          }
        });
      };
      $scope.showComments = true;

      $scope.ticketIdForComment;
      $scope.comments = [];
      $scope.viewComments = function (val) {
        // console.log(val);
        console.log(val._id);

        $scope.ticketIdForComment = val._id;
        managerServices.viewComments({ ticketId: val._id }, function (data) {
          if (data.data.length <= 0) {
            $scope.showNoComments = "No Comments";
            $scope.comments = "";
          } else {
            $scope.showNoComments = "";
            $scope.comments = data.data;
            $scope.showComments = false;
            $scope.ticketId = data.data._id;
          }
        });
      };

      $scope.addCommentsFormSubmit = function ($event) {
        console.log($scope.ticketIds);
        console.log($scope.addComments);
        var data = {
          comments: $scope.addComments,
          ticketId: $scope.ticketIdForComment,
          token,
        };
        employeeServices.addComment(data, function (response) {
          console.log(response);
          $scope.comments.push(response.data);
          alert("Comment submitted");
          $scope.addComments = "";
        });
      };

      $scope.employeesAssignedToTask;
      $scope.projectName;
      $scope.projectId;
      $scope.projectManager;
      $scope.projectManagerUsername;
      $scope.projectManagerName;
      $scope.addTasks = function (val) {
        console.log(val);

        $scope.employeesAssignedToTask = val.assignedTo;
        $scope.projectName = val.projectName;
        $scope.projectId = val._id;
        $scope.projectManager = val.projectManger.projectMangerId;
        $scope.projectManagerUsername = val.projectManger.username;
        $scope.projectManagerName = val.projectManger.name;
      };

      $scope.taskEmployeeList = [];
      $scope.taskEmployeeListView = [];
      $scope.taskEmployeeListed = function (val) {
        // console.log(val);
        if (val != undefined) {
          $scope.taskEmployeeListView.push(JSON.parse(val).username);
          $scope.taskEmployeeList.push({
            assignedUserId: JSON.parse(val).assignedUserId,
            name: JSON.parse(val).name,
            username: JSON.parse(val).username,
          });
        }
      };

      $scope.viewAssignedTask = function (val) {
        $scope.viewTask = "";
        var data = {
          userId: val.user.userId,
          projectId: val.project.projectId,
        };
        managerServices.viewAssignedTask(data, function (response) {
          if (response.data.length == 0) {
            $scope.showNoTaskAssigned = "No task Assigned";
            $scope.viewTask = "";
          } else {
            $scope.viewTask = response.data;
            $scope.showNoTaskAssigned = "";
          }
        });
      };
      $scope.showGoBackButton = true;
      $scope.managerViewTaskButton = function () {
        $scope.showManagerDashboard = true;
        $scope.showGoBackButton = false;
        $scope.showManagerDashboardButton = true;
        managerServices.showAllTask(token, function (response) {
          $scope.showTaskList = response.data;

          console.log(response.data);
        });
      };

      $scope.backToManagerDashBoard = function () {
        $scope.showManagerDashboard = false;
        $scope.showGoBackButton = true;
        $scope.showManagerDashboardButton = false;
      };

      $scope.addTaskFunction = function ($event) {
        $event.preventDefault();
        if (Date.now() <= $scope.startDate && Date.now() <= $scope.endDate) {
          if ($scope.startDate <= $scope.endDate) {
            var data = {
              taskName: $scope.taskName,
              taskDescription: $scope.taskDescription,
              taskeEmployeesAssigned: $scope.taskEmployeeList,
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              project: {
                ProjectName: $scope.projectName,
                projectId: $scope.projectId,
                projectManager: $scope.projectManager,
                projectManagerUsername: $scope.projectManagerUsername,
                projectManagerName: $scope.projectManagerName,
              },
              token,
            };
            managerServices.addTasks(data, function (response) {
              console.log(response);
              alert("Task Assigned");
              $scope.taskName = "";
              $scope.taskDescription = "";
              $scope.taskEmployeeList = [];
              $scope.taskEmployeeListView = [];
              $scope.startDate = "";
              $scope.endDate = "";
            });
          } else {
            alert("Enter the valid Date");
          }
        } else {
          alert("Enter the valid Date");
        }
      };

      function formatDateForInputDate(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
      }

      $scope.taskDetails = function (details) {
        $scope.taskId = details._id;
        $scope.updatedTaskName = details.task.taskName;
        $scope.updatedTaskDescription = details.task.taskDescription;

        var event = new Date(details.endDate);
        var eventStart = new Date(details.startDate);
        $scope.EndDateValue = formatDateForInputDate(event);
        $scope.StartDateValue = formatDateForInputDate(eventStart);
      };

      $scope.updateTaskFunction = function ($event) {
        $event.preventDefault();
        console.log(
          $scope.updatedTaskName,
          $scope.updatedTaskDescription,
          $scope.updatedEndDate,
          $scope.updatedStartDate
        );

        var data = {
          task: {
            taskName: $scope.updatedTaskName,
            taskDescription: $scope.updatedTaskDescription,
          },
        };
        if ($scope.updatedStartDate != undefined) {
          data.startDate = $scope.updatedStartDate;
        }
        if ($scope.updatedEndDate != undefined) {
          data.endDate = $scope.updatedEndDate;
        }
        console.log($scope.taskId);
        managerServices.updateTask($scope.taskId, data, function (response) {
          alert("Task updated");
          console.log(response);
        });
      };
      $scope.showNoAnalysis = false ;
      $scope.dateWiseAnalysis = function ($event) {
        if ($scope.startDateForAnalysis <= $scope.endDateForAnalysis) {
        var data = {
          startDate: $scope.startDateForAnalysis,
          endDate: $scope.endDateForAnalysis,
        };

        managerServices.dateWiseAnalysis(data, function (response) {
         
          if(response.data.length==0){
            $scope.analysis = response.data;
            $scope.showNoAnalysis = true ; 
          }else{
            $scope.analysis = response.data;
            $scope.showNoAnalysis = false ;
          }
        });
      }else{
        alert("Enter the valid date") ; 
      }
    }
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
