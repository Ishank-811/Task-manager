myApp.controller(
  "mangerController",
  function ($scope, $window, $timeout, managerServices, employeeServices) {
    var role = sessionStorage.getItem("role");
    $scope.username = sessionStorage.getItem("username");  
    $scope.organization = sessionStorage.getItem("organization"); 
    var token = sessionStorage.getItem("token");
    $scope.message = "Manager Dashboard";

    if (role == "Manager") {
      $scope.showManagerDashboard = true;
      $scope.ViewTicketLoader = true;
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
