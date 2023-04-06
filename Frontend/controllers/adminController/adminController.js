myApp.controller("adminController", function ($scope, $window,$timeout ,  adminServices , adminFactory) {

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
     adminFactory.employeeFilter(userData,  function(employeesAsigned , managerAssigned ,employeesAsignedStore ){
      $scope.employeesAsigned = employeesAsigned ; 
      $scope.response  = managerAssigned  ;
      $scope.employeesAsignedStore = employeesAsignedStore  ;
     })
    }
  });

  if (role != undefined && role == "Admin") {
  } else {
    $window.location.href = "#!/singinAsUsers";
  }
  


});
