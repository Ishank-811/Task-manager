myApp.controller("adminController", function ($scope, $window,$timeout ,  adminServices) {

  var role = sessionStorage.getItem("role");
  $scope.username = sessionStorage.getItem("username");  
  $scope.organization = sessionStorage.getItem("organization"); 
  var token = sessionStorage.getItem("token");

  adminServices.readingData(token, function (data) {
    var userData = data.data.response ; 
    if (data.data.role != "Admin") {
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
    // $window.location.href = "#!/AdminDashboard";
  } else {
    $window.location.href = "#!/singinAsUsers";
  }
  
  $scope.fastestPaceProjectFunction = function(){
  }
  $scope.deleteProject = function (val) {
    console.log(val);
  };
});
