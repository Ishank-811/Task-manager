myApp.controller(
  "signinAsOrganizationController",
  function ($scope, $window, signinServices) {
    $scope.signinMessage = "SIGN IN";
    $scope.siginFunAsOrganization = function ($event) {
      $event.preventDefault();
      $scope.signinMessage = "SIGNING...";
      var LoggedinOrganization = {
        username: $scope.email,
        password: $scope.password,
      };
    
      signinServices.SiginAsOrganization(LoggedinOrganization, function (data) {
        if (data.data.token) {
          $window.alert("successfully logged in as organization");
          sessionStorage.setItem("token", data.data.token);
          sessionStorage.setItem("RoleAsOrganization", true);
          $window.location.href = "#!/organizationDashboard";
        } else {
          $scope.showError = true;
          $scope.signinMessage = "SIGN IN";
        }
      });
    };
  }
);
