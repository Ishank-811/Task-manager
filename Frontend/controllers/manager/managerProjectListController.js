myApp.controller(
  "managerProjectListController",
  function ($scope, $timeout, managerServices) {
    var token = sessionStorage.getItem("token");



    $scope.timeleft = function (endDate) {
      var today = new Date();
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - today.getTime();
      return Math.round(diff / 86400000);
    };



    
    $scope.errorHandlingObject = {
      viewManagerDashBoardLoader: false,
      showNoProjectAssigned: false,
    };
    $scope.displayUserList = false;
    $scope.onfocusfun = function () {
      $scope.displayUserList = true;
    };







    var numberOfPages = function (count) {
      $scope.pageSize = 8;
      $scope.totalPages = Math.ceil(count / $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
    };






    $scope.currentPage = 1;
    var fetchProjectsFunction = function (currentPage) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.response = [];
      managerServices.readingdata({ token, currentPage }, function (data) {
        numberOfPages(data.data.countNum);
      
        $scope.response = data.data.projectDetails;

        $scope.managerId = $scope.response[0].projectManger.projectMangerId;
     

        if ($scope.response.length == 0) {
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: true,
          };
        } else {
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: false,
          };
        }
      });
    };
    fetchProjectsFunction($scope.currentPage);
    $scope.setPage = function (pageNumber) {
      $scope.currentPage = pageNumber;
      fetchProjectsFunction($scope.currentPage);
    };

    $scope.sendAssignedData = function (assignedUser) {
      managerServices.setData(assignedUser);
    };








    $scope.addTaskObject = {
      taskName: "",
      taskDescription: "",
      taskeEmployeesAssigned: [],
      startDate: "",
      endDate: "",
    };
    $scope.employeeObject = {
      taskeEmployeesAssigned: [],
      employees: [],
    };
    $scope.addTasks = function (
      _id,
      projectName,
      projectMangerId,
      username,
      name,
      documents
    ) {
      $scope.employeesAssignedToTask = documents;
      $scope.projectDetails = {
        _id,
        projectName,
        projectManger: {
          projectMangerId,
          username,
          name,
        },
      };
    };
    $scope.addTaskFunction = function ($event) {
      $event.preventDefault();
      if (
        Date.now() <= $scope.addTaskObject.startDate &&
        Date.now() <= $scope.addTaskObject.endDate
      ) {
        if ($scope.addTaskObject.startDate <= $scope.addTaskObject.endDate) {
          $scope.employeeObject.taskeEmployeesAssigned.forEach(function (
            userData
          ) {
            if (userData !== undefined && userData !== null) {
              $scope.employeeObject.employees.push({
                assignedUserId: userData.assignedTo.assignedUserId,
                name: userData.assignedTo.name,
                username: userData.assignedTo.username,
              });
            }
          });
          $scope.addTaskObject["taskeEmployeesAssigned"] =
            $scope.employeeObject.employees;

          managerServices.addTasks(
            $scope.addTaskObject,
            $scope.projectDetails,
            token,
            function (response) {
              alert("Task Assigned");
              $(function () {
                $("#addTaskModal").modal("hide");
              });
              $scope.addTaskObject = {
                taskName: "",
                taskDescription: "",
                taskeEmployeesAssigned: [],
                startDate: "",
                endDate: "",
              };
              $scope.employeeObject = {
                taskeEmployeesAssigned: [],
                employees: [],
              };
              $scope.employeesAssignedToTask = [];
              $scope.displayUserList = false;
              $scope.employeeListObject = {
                taskEmployeeList: [],
                taskEmployeeListView: [],
              };
            }
          );
        } else {
          alert("Enter the valid Date");
        }
      } else {
        alert("Enter the valid Date");
      }
    };











    var debounceTimer;
    $scope.searchProjectFunction = function (projectNameValue) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.response = [];
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        managerServices.searchProject(
          projectNameValue,
          $scope.managerId,
          function (response) {
            $scope.response = response.data;
            numberOfPages($scope.response.length);
            if ($scope.response.length == 0) {
              $scope.errorHandlingObject = {
                viewManagerDashBoardLoader: true,
                showNoProjectAssigned: true,
              };
            } else {
              $scope.errorHandlingObject = {
                viewManagerDashBoardLoader: true,
                showNoProjectAssigned: false,
              };
            }
          }
        );
      }, 800);
    };
  }
);
