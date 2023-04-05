myApp.controller(
  "mangerController",
  function ($scope, $window) {
    var role = sessionStorage.getItem("role");
    $scope.username = sessionStorage.getItem("username");  
    $scope.organization = sessionStorage.getItem("organization"); 
    if (role == "Manager") {
      $scope.showManagerDashboard = true;
      $scope.ViewTicketLoader = true;
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
 