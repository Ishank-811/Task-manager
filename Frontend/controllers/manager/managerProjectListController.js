myApp.controller(
  "managerProjectListController",
  function ($scope, $timeout, managerServices) {
    var token = sessionStorage.getItem("token");



    $scope.timeleft = function (endDate) {
      var today = new Date();
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - today.getTime();
      return Math.round(diff / 86400000);
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

    $scope.resetFilter = function(){
      $scope.filterObject={}; 
    }


    $scope.filterObject={}; 

    $scope.currentPage = 1;
    var fetchProjectsFunction = function (currentPage , filterObject) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.response = [];
      
      managerServices.readingdata({ token, currentPage },filterObject, function (data) {
        numberOfPages(data.data.countNum);
      
        $scope.response = data.data.projectDetails;
          if($scope.response[0]){
        $scope.managerId = $scope.response[0].projectManger.projectMangerId;
          }

        if ($scope.response.length == 0) {
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
      $scope.employeesAssignedToTask =  documents.map(function(element){
        return element.assignedTo ; 
      })
      $scope.employeesAssignedToTaskStore =  documents.map(function(element){
        return element.assignedTo ; 
      })
      $scope.projectDetails = {_id,projectName,
        projectManger: {projectMangerId,username,name,},
      }; 
      $scope.selectedUser=[]; 
      $scope.displayUserList = false;
    };
  
    $scope.selectedUser=[];
    $scope.assignedUserChecksChange = function (index) {
      $scope.selectedUser.push($scope.employeesAssignedToTask[index]);
      $scope.employeesAssignedToTask.splice(index,1) ;
    };

    $scope.undoSelected =function(index){
      $scope.employeesAssignedToTask.push($scope.selectedUser[index]); 
      $scope.selectedUser.splice(index,1); 
    } 
    

    $scope.addTaskFunction = function ($event) {
      $event.preventDefault();
      if (
        Date.now() <= $scope.addTaskObject.startDate &&Date.now() <= $scope.addTaskObject.endDate
      ) {
        if ($scope.addTaskObject.startDate <= $scope.addTaskObject.endDate) {
          $scope.addTaskObject["taskeEmployeesAssigned"] =$scope.selectedUser;            
          managerServices.addTasks( $scope.addTaskObject,$scope.projectDetails, token,
            function (response) {
              alert("Task Assigned");
              $(function () {
                $("#addTaskModal").modal("hide");
              });
              $scope.addTaskObject.taskeEmployeesAssigned= [],
              $scope.employeesAssignedToTask = [];
              $scope.displayUserList = false;
            }
          );
        } else {
          alert("Enter the valid Date");
        }
      } else {
        alert("Enter the valid Date");
      }
    };


   

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
            $scope.response = response.data;
            numberOfPages($scope.response.length);
            if ($scope.response.length == 0) {
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
