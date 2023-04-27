myApp.controller(
  "organizationController",
  function ($scope, $window, $timeout, organizationServices , adminServices) {
    var token = sessionStorage.getItem("token");

    if (token != null) {
      $scope.filterEmployee = null;
      $scope.showNoEmployees = false;
      $scope.adminId;
      $scope.currentPage = 1;

      $scope.resetFilter = function () {
        $scope.filterEmployee = null;
        readingData($scope.currentPage, $scope.filterEmployee);
      };

      var readingData = function (currentPage, filterEmployee) {
        organizationServices.ReadingData(
          currentPage,
          filterEmployee,
          token,
          function (data) {
              if (!data.data.roleAsOrganization) {
              } else {
                numberOfPages(data.data.countNum);
                $scope.response = data.data.usersdata;
                $scope.adminId = data.data.adminId;
                if ($scope.response.length == 0) {
                  $scope.showNoEmployees = true;
                } else {
                  $scope.showNoEmployees = false;
                }
              }
            }
        );
      };
      readingData($scope.currentPage, $scope.filterEmployee);
    } else {
      location.href = "#!/signinAsUsers";
    }

    var numberOfPages = function (count) {
      $scope.pageSize = 8;
      $scope.totalPages = Math.ceil(count / $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
    };

    $scope.setPage = function (pageNumber) {
      $scope.currentPage = pageNumber;
      readingData($scope.currentPage, $scope.filterEmployee);
    };

    $scope.filterEmployeeChange = function (filterEmployee) {
      $scope.filterEmployee = filterEmployee;
      readingData($scope.currentPage, $scope.filterEmployee);
    };

    $scope.addUsersDetails = function ($event) {
      $event.preventDefault();
      organizationServices.sendingdata(
        $scope.createEmployee,
        token,
        function (data) {
         
          if (data.status == 404) {
            $scope.showError = true;
          } else {
            alert("User Created");
            $(function () {
              $("#CreateModal").modal("hide");
            });
            $scope.createEmployee = {};
            $scope.response.pop();
            $scope.response.unshift(data.data);

            $scope.showError = false;
          }
        }
      );
    };

    $scope.displayForm = false;

    var debounceTimer;

    $scope.searchEmployeeFunction = function (employeeValue) {
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        organizationServices.searchUser( $scope.adminId , employeeValue, function (response) {
       
          $scope.response = response.data;
        });
      }, 800);
    };


    $scope.deleteUser = function(employeeId , role){
      organizationServices.deleteUser(employeeId , role , function(response){  
        var indexToReplace = $scope.response.findIndex(function(element){
          return element._id == employeeId
      });
      if (indexToReplace !== -1) {
          $scope.response.splice(indexToReplace, 1, response.data);
        }
        alert("employee Deleted") ; 
      })
    }


    $scope.activateUser= function(employeeId){
      organizationServices.activateUser(employeeId  , function(response){
        var indexToReplaceForActivate = $scope.response.findIndex(function(element){
          return element._id == employeeId
      });
      if (indexToReplaceForActivate !== -1) {
          $scope.response.splice(indexToReplaceForActivate, 1, response.data);
        }
        alert("employee Activated") ; 
      })
    }

    $scope.showUserExist = false;  
    $scope.updateUser = function (employeeUpdateDetails) {
      $scope.employeeUpdateDetails = employeeUpdateDetails;
      $scope.updateFormDetails = function ($event) {
        $event.preventDefault();
        organizationServices.updateUser(
          $scope.employeeUpdateDetails,
          function (response) {
        
            if(response.status==204){
              $scope.showUserExist = true;  
            }else{
            alert("user Updated"); 
            $(function () {
              $("#myModal").modal("hide");
            });
            $scope.showUserExist = false;  
          }
          }
        );
    }
    };



    var numberOfPagesForProject = function(count){
      $scope.pageSizeForProject = 5;
        $scope.totalPagesForProjects = Math.ceil(count/ $scope.pageSizeForProject);
        console.log($scope.totalPagesForProjects); 
        $scope.pagesForProject = [];
        for (var i = 1; i <= $scope.totalPagesForProjects; i++) {
          $scope.pagesForProject.push(i);
        }
    }
  
  $scope.currentPage = 1 ; 
    $scope.fetchUserDetails = function (userData , currentPage) {
      $scope.employeeHandlingObject = {
        showError:true ,
        userData,
        EmployeeticketDetails:[],
        showEmployeeTicketTable:true
      }
      adminServices.showEmployeeProjects(userData._id, userData.organization.organizationId,currentPage, userData.role,
        function (response) {
          $scope.employeeProjects = response.projectData;
          console.log(response.count); 
          numberOfPagesForProject(response.count);
          if (response.count == 0) {
            $scope.employeeHandlingObject.showError = false;
            $scope.showEmployeeTicketTable = true;
          } else {
            $scope.employeeHandlingObject.showError = true;
            $scope.employeeHandlingObject.showEmployeeTicketTable = false;
            $scope.employeeHandlingObject.EmployeeticketDetails = response;
          }
        }
      );
      
    };
  
    $scope.setPageForProjects = function (pageNumber) {
      $scope.currentPageForProject = pageNumber;
      $scope.fetchUserDetails( $scope.employeeHandlingObject.userData ,$scope.currentPageForProject);
    };


    
  }
);
