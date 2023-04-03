myApp.controller("adminEmployeesController", function ($scope, adminServices) {


 
  var numberOfPages = function(count){
    $scope.pageSize = 5;
      $scope.totalPages = Math.ceil(count/ $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
  }

$scope.currentPage = 1 ; 
  $scope.fetchUserDetails = function (userData , currentPage) {
    $scope.object = {
      showError:true ,
      userData,
      EmployeeticketDetails:[],
      showEmployeeTicketTable:true
    }
    adminServices.showEmployeeProjects(userData._id, userData.organization.organizationId,currentPage, userData.role,
      function (response) {

        $scope.employeeProjects = response.projectData;
        numberOfPages(response.count);
        if (response.length == 0) {
          $scope.object.showError = false;
          $scope.showEmployeeTicketTable = true;
        } else {
          $scope.object.showError = true;
          $scope.object.showEmployeeTicketTable = false;
          $scope.object.EmployeeticketDetails = response;
        }
      }
    );
    
  };

  $scope.setPage = function (pageNumber) {
    $scope.currentPage = pageNumber;
    $scope.fetchUserDetails( $scope.object.userData ,$scope.currentPage);
  };
});
