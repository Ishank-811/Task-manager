myApp.controller(
  "updateProjectDetailsController",
  function ($scope, $stateParams, $window, updateProjectDetailsServices) {
    $scope.message = "Hello";

    $scope.employeesAsignedFiltered = [];
    var array1 = [];
    $scope.updateAssignedEmployee = [];
    var storemployeesAsigned = [];
    $scope.allEmployeesChange = true;
    updateProjectDetailsServices.readingdata($stateParams.id, function (data) {
      array1 = data.data.assignedTo.map(function (element) {
        return element.assignedUserId;
      });
      console.log(array1);
      console.log($scope.employeesAsigned);
      storemployeesAsigned = $scope.employeesAsigned;
      console.log(storemployeesAsigned);
      $scope.employeesAsignedFiltered = $scope.employeesAsigned.filter(
        function (element) {
          return !array1.includes(element._id);
        }
      );
      console.log($scope.employeesAsignedFiltered);
      $scope.updateAssignedEmployee = data.data.assignedTo;
      $scope.updatedProjectName = data.data.projectName;
      $scope.managerUsername = data.data.projectManger.username;
    });
    $scope.allEmployeesChanged = true;

    $scope.employeeAddedChange = function (val) {
      if (val == undefined || val == null) {
        $scope.allEmployeesChanged = true;
      } else {
        $scope.allEmployeesChanged = false;
      }
    };

    $scope.deleteAssingedUser = function (userId) {
      if ($scope.updateAssignedEmployee.length <= 1) {
        $window.alert("add more users to delete");
      } else {
        var data = {
          userId: userId.assignedUserId,
          projectId: $stateParams.id,
        };
        updateProjectDetailsServices.deleteuser(data, function (response) {
          alert("Employee deleted");
          console.log(response);
          array1 = response.data.assignedTo.map(function (element) {
            return element.assignedUserId;
          });
          console.log(array1);
          $scope.updateAssignedEmployee = response.data.assignedTo;
          console.log(storemployeesAsigned);
          $scope.employeesAsignedFiltered = storemployeesAsigned.filter(
            function (element) {
              return !array1.includes(element._id);
            }
          );
        });
      }
    };

    $scope.projectNameChanged = true;
    $scope.updatedProjectNameFunction = function (val) {
      $scope.projectNameChanged = false;
    };

    $scope.addEmployeesSubmit = function () {
      var userDetails = JSON.parse($scope.employeeAdded);
      var data = {
        projectId: $stateParams.id,
        userDetails,
      };
      updateProjectDetailsServices.addEmployees(data, function (response) {
        console.log(response);
        $scope.updateAssignedEmployee = response.data.assignedTo;
        alert("employee added");
        $scope.employeeAdded = "";
        $scope.allEmployeesChanged = true;
      });
    };
  }
);
