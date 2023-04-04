myApp.controller(
  "employeeController",
  function ($scope, $window, employeeServices) {

    var token = sessionStorage.getItem("token");
    var role = sessionStorage.getItem("role");
    $scope.username = sessionStorage.getItem("username");  
    $scope.organization = sessionStorage.getItem("organization"); 
    
    if (role == "Employee") {


      // $window.location.href = "#!/EmployeeDashboard";
      $scope.sortedFormObject = {}  ; 
      $scope.projectSortedByFunction=  function(sortedForm){
        if( sortedForm=='oldest'){
          $scope.sortedFormObject._id=1
        }else if(sortedForm=='new'){
          $scope.sortedFormObject._id=-1
        }
        fetchingProjects($scope.currentPage , $scope.sortedFormObject);
      }

      $scope.projectAssigned = [];
     

      $scope.timeleft=  function(endDate){
        var today = new Date();
        var endTimestamp = Date.parse(endDate);
        var diff = endTimestamp - today.getTime();
        return Math.round(diff / 86400000);
        }

        $scope.projectFilterFunction = function(projectFilter){
          fetchingProjects($scope.currentPage , $scope.sortedFormObject  , projectFilter);
        }



      var numberOfPages = function(count){
        $scope.pageSize = 5;
          $scope.totalPages = Math.ceil(count/ $scope.pageSize);
          $scope.pages = [];
          for (var i = 1; i <= $scope.totalPages; i++) {
            $scope.pages.push(i);
          }
      }



      $scope.resetFilter = function(){
        $scope.projectFilter = "";
        $scope.sortedFormObject = {}; 
        $scope.projectSortedBy="" ;  
        fetchingProjects($scope.currentPage , $scope.sortedFormObject  , undefined);
      }
 



      $scope.currentPage = 1;
      var fetchingProjects = function(currentPage ,sortedFormObject , projectFilter ){
      employeeServices.readingdata(currentPage ,sortedFormObject,projectFilter ,  token, function (response) {
        $scope.projectAssigned = response.data.projectDetails;
        numberOfPages(response.data.countNum); 
      });
    }
    fetchingProjects($scope.currentPage , $scope.sortedFormObject); 
    $scope.setPage = function (pageNumber) {
      $scope.currentPage = pageNumber;
      fetchingProjects( $scope.currentPage);
    };

      $scope.startTicket = function (index) {
        employeeServices.addTicket(
          $scope.projectAssigned[index],
          token,
          function () {
            alert("ticket has been initiaited");
            $scope.projectAssigned[index].assignedTo.isStarted = true;
          }
        );
      };



      
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
    $scope.message = "Employee View";
  }
);
