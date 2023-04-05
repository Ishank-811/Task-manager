myApp.controller("adminController", function ($scope, $window,$timeout ,  adminServices) {

  var role = sessionStorage.getItem("role");
  $scope.username = sessionStorage.getItem("username");  
  $scope.organization = sessionStorage.getItem("organization"); 
  var token = sessionStorage.getItem("token");

  adminServices.readingData(token, function (userData , userRole) {
    if (userRole != "Admin") {
      $window.location.href = "#!/singinAsUsers";
    } 
    else {
     $scope.totalEmployees= userData  ;
    $scope.employeesAsigned = userData.filter(function (val) {
        return val.role == "Employee";
      });
      $scope.response = userData.filter(function (val) {
        return val.role == "Manager";
      });
     $scope.employeesAsignedStore= userData.filter(function (val) {
      return val.role == "Employee";
    });
    }
  });

  if (role != undefined && role == "Admin") {
  } else {
    $window.location.href = "#!/singinAsUsers";
  }
  

  $scope.deleteProject = function (val) {
    console.log(val);
  };
});
