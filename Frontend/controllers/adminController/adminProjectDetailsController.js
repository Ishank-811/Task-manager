myApp.controller(
  "adminProjectDetailsController",
  function (
    $scope,
    $stateParams,
    adminServices,
    managerServices,
    adminFactory,
    managerFactory
  ) {
    var token = sessionStorage.getItem("token");

    $scope.object = {
      allEmployeesChanged: true,
      showNoTaskAssigned: true,
      showInformation: false,
      showstatusLoader: true,
      viewTask: "",
    };

    $scope.employeeAddedChange = function () {
      $scope.object.allEmployeesChanged = false;
    };

    //time left logic starts

    $scope.getDaysDiff = function (startDate, endDate) {
     return  adminFactory.getDaysDiff(startDate , endDate); 
    };
    $scope.timeleft = function (endDate) {
     return managerFactory.timeleft(endDate); 
    };
    //time left logic ends

    $scope.employeesOfProject = [];
    $scope.employeesAsignedFiltered = [];
    $scope.loaderObject = {
      projectSpecificationLoader: false,
      showprojectSpecification: true,
    };


    adminServices.fetchProjectDetails($stateParams.projectId,token,
      function (employeesOfProject , projectDetails , storingArray) {
        $scope.employeesOfProject = employeesOfProject;
        $scope.projectDetails = projectDetails;
        $scope.loaderObject = {
          projectSpecificationLoader: true,
          showprojectSpecification: false,
        };
        $scope.employeesAsignedFiltered = $scope.employeesAsigned.filter(
          function (element) {
            return !storingArray.includes(element._id);
          }
        );
      }
    );

    
    $scope.viewAssignedTask = function (userId, projectId) {
      $scope.object.viewTask = "";
      $scope.object.showNoTaskAssigned = true;
      managerServices.viewAssignedTask(userId, projectId, function (viewTask) {
        if (viewTask.length == 0) {
          $scope.object.showNoTaskAssigned = false;
          $scope.object.viewTask = "";
        } else {
          $scope.object.viewTask = viewTask;
          $scope.object.showNoTaskAssigned = true;
        }
      });
    };


    $scope.employeeProjectStatus = function (projectId, employeeDetails) {
      $scope.object.showstatusLoader = false;
      $scope.object.showInformation = false;
      $scope.object.viewTask = "";
      adminServices.viewTicket(
        projectId,
        employeeDetails.assignedUserId,
        function (employeeProjectStatusDetails) {
          $scope.object.showstatusLoader = true;
          $scope.object.showInformation = true;
          $scope.object.viewTask = "";
          $scope.employeeProjectStatusDetails = employeeProjectStatusDetails;
        }
      );
    };
 
    $scope.addEmployeesSubmit = function ($event) {
      $event.preventDefault();
      var userDetails = JSON.parse($scope.employeeAdded);
      adminServices.addEmployees(
        $scope.projectDetails,
        userDetails,
        function (response) {
          $scope.employeesOfProject.push(response.data);
          alert("employee added to the project");
          $(function () {
            $("#myModal3").modal("hide");
          });
          $scope.employeeAdded = "";
          $scope.object.allEmployeesChanged = true;
        }
      );
    };

    $scope.showProjectTask = function (projectName, projectId) {
      $scope.projectName = projectName;
      managerServices.showProjectTask(projectId, token, function (response) {
        $scope.viewTask = response.data;
      });
    };
    $scope.progressDivs = ["Inactive", "Started", "working", "completed"];

    $scope.deleteAssingedUser = function (projectId, userId, firstName, index) {
      if ($scope.employeesOfProject.length > 1) {
        adminServices.deleteuser(projectId, userId, function () {
          alert("employee Deleted");
          $(function () {
            $("#myModal3").modal("hide");
          });
          $scope.employeesOfProject.splice(index, 1);
          $scope.employeesAsignedFiltered.push({ firstName, _id: userId });
        });
      } else {
        alert("Add more employee to delete this user");
      }
    };
  }
);
