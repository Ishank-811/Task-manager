myApp.controller("adminController", function ($scope, $window, adminServices) {
  var role = sessionStorage.getItem("role");
  var token = sessionStorage.getItem("token");

  if (role != undefined && role == "Admin") {
    $window.location.href = "#!/AdminDashboard";
  } else {
    $window.location.href = "#!/singinAsUsers";
  }
  $scope.project = [];
  $scope.response = [];
  $scope.employeesAsigned = [];
  var array1 = [];
  adminServices.readingData(token, function (data) {
    if (data.data.role != "Admin") {
      $window.location.href = "#!/singinAsUsers";
    } else {
      $scope.count = data.data.response[1];

      $scope.employeesAsigned = data.data.response[0].filter(function (val) {
        return val.role == "Employee";
      });
      $scope.response = data.data.response[0].filter(function (val) {
        return val.role == "Manager";
      });
    }
  });

  var managerId, mangerName, managerUsername;
  $scope.projectManagerChange = function (value) {
    managerId = JSON.parse(value)._id;
    mangerName = JSON.parse(value).firstName;
    managerUsername = JSON.parse(value).username;
    console.log(managerId);
  };

  var employees = [];
  $scope.employeeList = [];
  var employeesAsignedFiltered = [];
  $scope.employeeListed = function (val) {
    employees.push({
      assignedUserId: JSON.parse(val)._id,
      name: JSON.parse(val).firstName,
      username: JSON.parse(val).username,
    });
    array1 = employees.map(function (element) {
      return element.assignedUserId;
    });
    console.log(array1);
    employeesAsignedFiltered = $scope.employeesAsigned.filter(function (
      element
    ) {
      return !array1.includes(element._id);
    });

    $scope.employeeList.push(JSON.parse(val).username);
  };
  $scope.createProjectLoader = true;
  $scope.ProjectFormDetails = function ($event) {
    $event.preventDefault();

    if (Date.now() <= $scope.startDate && Date.now() <= $scope.endDate) {
      $scope.createProjectLoader = false;
      if ($scope.startDate <= $scope.endDate) {
        var projectDetails = {
          projectName: $scope.updatedFirstName,
          projectManger: {
            projectMangerId: managerId,
            name: mangerName,
            username: managerUsername,
          },
          assignedTo: employees,
          priority: $scope.priorityStatus,
          createdAt: new Date(),
          startDate: $scope.startDate,
          endDate: $scope.endDate,
        };

        adminServices.creatingPorject(projectDetails, function (data) {
          if (data.status == 404) {
            $scope.showError = true;
            $scope.createProjectLoader = true;
          } else {
            $scope.createProjectLoader = true;
            $scope.project.pop();
            $scope.project.unshift(data.data);
            alert("Project created");
            console.log(data);
            $scope.updatedFirstName = "";
            $scope.projectManager = "";
            $scope.showError = false;
            $scope.employeeList = [];
            $scope.employeesAssigned = "";
            ($scope.priorityStatus = ""),
              (employees = []),
              ($scope.startDate = ""),
              ($scope.endDate = "");
          }
        });
      } else {
        alert("Enter the valid Date");
      }
    } else {
      alert("Enter the valid Date");
    }
  };

  $scope.deleteProject = function (val) {
    console.log(val);
  };
  $scope.selectedProjectId;
  $scope.selectEmployeeId;
  $scope.showProfile = function (projectId, val) {
    $scope.showEmployeeTicketTable = true;
    $scope.selectedProjectId = projectId;
    $scope.selectEmployeeId = val;

    console.log(projectId, val);
    $scope.showStatusError = true;
    adminServices.viewProfile(val, function (response) {
      console.log(response);
      $scope.showStatusError = true;
      $scope.employeeFirstName = response.data.firstName;
      $scope.employeeLastName = response.data.lastName;
      $scope.employeeUsername = response.data.username;
      $scope.employeeRole = response.data.role;
      $scope.employeeOrganization = response.data.organization.name;
    });
  };
  $scope.showEmployeeTicketTable = true;

  $scope.showEmployeeTicket = function () {
    $scope.showStatusError = true;

    var data = {
      projectId: $scope.selectedProjectId,
      employeeId: $scope.selectEmployeeId,
    };
    adminServices.showEmployeeTicket(data, function (response) {
      $scope.showStatusError = true;
      if (response.data.length == 0) {
        $scope.showStatusError = false;
      } else {
        $scope.showEmployeeTicketTable = false;
        $scope.showStatusError = true;
        $scope.EmployeeticketDetails = response.data;
      }
    }); 
  };

  $scope.allProjectDetailsLoader = false;
  $scope.currentPage = 1;
  var fetchProjectsFunction = function (currentPage) {
    $scope.allProjectDetailsLoader = false;
    $scope.project = [];
    adminServices.fetchProjects({ token, currentPage }, function (data) {
      $scope.allProjectDetailsLoader = true;
      $scope.project = data.data;
      $scope.pageSize = 8;
      console.log($scope.count);
      $scope.totalPages = Math.ceil($scope.count / $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
    });
  };
  fetchProjectsFunction($scope.currentPage);
  $scope.setPage = function (pageNumber) {
    $scope.currentPage = pageNumber;
    fetchProjectsFunction($scope.currentPage);
    console.log($scope.currentPage);
  };
});
