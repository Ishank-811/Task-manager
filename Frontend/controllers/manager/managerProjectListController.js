myApp.controller(
  "managerProjectListController",
  function ($scope, $timeout, managerServices , managerFactory) {
    var token = sessionStorage.getItem("token");



    $scope.timeleft = function (endDate) {
    return managerFactory.timeleft(endDate); 
    };


    
    $scope.errorHandlingObject = {
      viewManagerDashBoardLoader: false,
      showNoProjectAssigned: false,
    };
    $scope.displayUserList = false;
    $scope.onfocusfun = function () {
      $scope.displayUserList = true;
    };





    var numberOfPages = function (count) {
      $scope.pageSize = 8;
      $scope.totalPages = Math.ceil(count / $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
    };
    $scope.filterObject={}; 
    $scope.resetFilter = function(){
      $scope.filterObject={}; 
    }
    $scope.currentPage = 1;
    var fetchProjectsFunction = function (currentPage , filterObject) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.response = [];
      managerServices.readingdata({ token, currentPage },filterObject, function (countNum ,projectDetails) {
        numberOfPages(countNum);
        $scope.response = projectDetails;
          if(projectDetails[0]){
        $scope.managerId = projectDetails[0].projectManger.projectMangerId;
          } 
        if (projectDetails.length == 0) {
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: true,
          };
        } else {
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: false,
          };
        }
      });
    };


    
    fetchProjectsFunction($scope.currentPage , $scope.filterObject);
    $scope.setPage = function (pageNumber) {
      $scope.currentPage = pageNumber;
      fetchProjectsFunction($scope.currentPage , $scope.filterObject);
    };

    $scope.filterFunction = function(){
      fetchProjectsFunction(1 , $scope.filterObject);
      $(function () {
        $("#filterProjectList").modal("hide");
      });
    }


    $scope.sendAssignedData = function (assignedUser) {
      managerServices.setData(assignedUser);
    };


    $scope.addTaskObject = {
      taskeEmployeesAssigned: [],
    };
    $scope.employeesAssignedToTask=[];
    $scope.addTasks = function (
      _id,projectName,projectMangerId,username,name,documents
    ) {
      managerFactory.addTaskCallingFactory(documents , function(employeesAssignedToTask ,employeesAssignedToTaskStore ){
        $scope.employeesAssignedToTask = employeesAssignedToTask  ;
        $scope.employeesAssignedToTaskStore = employeesAssignedToTaskStore ; 
      })
      $scope.projectDetails = {_id,projectName,
        projectManger: {projectMangerId,username,name,},
      }; 
      $scope.selectedUser=[]; 
      $scope.displayUserList = false;
    };
  

    $scope.selectedUser=[];
    $scope.assignedUserChecksChange = function (employeesAssignedToTask,employeeIdForindex) {
      var index = employeesAssignedToTask.findIndex(function(element){
        return element.assignedUserId==employeeIdForindex ; 
      })
      $scope.selectedUser.push($scope.employeesAssignedToTask[index]);
      $scope.employeesAssignedToTask.splice(index,1) ;
    };

    $scope.undoSelected =function(index){
      $scope.employeesAssignedToTask.push($scope.selectedUser[index]); 
      $scope.selectedUser.splice(index,1); 
    } 
    

    $scope.addTaskFunction = function ($event) {
      $event.preventDefault();
      managerFactory.addTaskFunctionValidation($scope.addTaskObject ,$scope.selectedUser , function(valid , addTaskObject){
        if(valid){
          managerServices.addTasks( addTaskObject,$scope.projectDetails, token,
            function () {
              alert("Task Assigned");
              $(function () {
                $("#addTaskModal").modal("hide");
              });
              $scope.addTaskObject.taskeEmployeesAssigned= [],
              $scope.employeesAssignedToTask = [];
              $scope.displayUserList = false;
            }
          );
        }else{
          alert("Enter the Valid Date"); 
        }
      }); 
    }


   

    $scope.resetFunction = function () {      
      $scope.addTaskObject={
        askeEmployeesAssigned: []
      };
      $scope.employeesAssignedToTask = [];
      $scope.displayUserList = false;
      $scope.employeesAssignedToTask = $scope.employeesAssignedToTaskStore
      $scope.selectedUser=[]; 
    };






    var debounceTimer;
    $scope.searchProjectFunction = function (projectNameValue) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.response = [];
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        managerServices.searchProject(
          projectNameValue,
          $scope.managerId,
          function (response) {
            $scope.response = response;
            numberOfPages(response.length);
            if (response.length == 0) {
              $scope.errorHandlingObject = {
                viewManagerDashBoardLoader: true,
                showNoProjectAssigned: true,
              };
            } else {
              $scope.errorHandlingObject = {
                viewManagerDashBoardLoader: true,
                showNoProjectAssigned: false,
              };
            }
          }
        );
      }, 800);
    };
  }
);
