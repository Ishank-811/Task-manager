myApp.controller(
  "signinAsOrganizationController",
  function ($scope, $window, signinServices) {
    $scope.siginFunAsOrganization = function ($event) {
      $event.preventDefault();

      var LoggedinOrganization = {
        username: $scope.email,
        password: $scope.password,
      };
      console.log(signinServices);
      signinServices.SiginAsOrganization(LoggedinOrganization, function (data) {
        if (data.data.token) {
          $window.alert("successfully logged in as organization");
          sessionStorage.setItem("token", data.data.token);
          sessionStorage.setItem("RoleAsOrganization", true);
          $window.location.href = "#!/organizationDashboard";
        } else {
          $scope.showError = true;
        }
      });
    };
  }
);
