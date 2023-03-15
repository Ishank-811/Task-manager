myApp.controller(
  "signinAsUsersController",
  function ($scope, $window, signinServices) {
    $scope.signinMessage = "SIGN IN";
    $scope.siginFunAsUser = function ($event) {
      $event.preventDefault();
      $scope.signinMessage = "SIGNING...";
      var LoggedinOrganization = {
        username: $scope.username,
        password: $scope.password,
      };
      signinServices.SiginAsUsers(LoggedinOrganization, function (data) {
        console.log(data.data.token);
        console.log(data);
        if (data.data.token) {
          sessionStorage.setItem("token", data.data.token);
        } else {
          $scope.showError = true; 
          $scope.signinMessage = "SIGN IN";
          return;
        }
        if (data.data.token && data.data.role == "Admin") {
          $window.location.href = "#!/AdminDashboard";
          sessionStorage.setItem("role", data.data.role);
        } else if (data.data.token && data.data.role == "Manager") {
          $window.location.href = "#!/MangerDashboard";
          sessionStorage.setItem("role", data.data.role);
        } else if (data.data.token && data.data.role == "Employee") {
          $window.location.href = "#!/EmployeeDashboard";
          sessionStorage.setItem("role", data.data.role);
        } else if (data.data.token && data.data.role == "SuperAdmin") {
          $window.location.href = "#!/superAdmin";
          sessionStorage.setItem("role", data.data.role);
        }
      });
    };
  }
);
