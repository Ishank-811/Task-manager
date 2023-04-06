myApp.controller(
  "adminProjectController",
  function ($scope, $timeout, $window, adminServices , managerFactory , adminFactory) {
    var token = sessionStorage.getItem("token");
 
   
    $scope.filterObject = {
      priorityFilter: null,
      createdStartDateFilter: null,
      createdEndDateFilter: null,
      startDateFilter: null,
      endDateFilter: null,
    };

    //time left logic starts

    $scope.getDaysDiff = function (startDate, endDate) {
      return  adminFactory.getDaysDiff(startDate , endDate); 
    };
    $scope.timeleft = function (endDate) {
      return managerFactory.timeleft(endDate); 
    };
    //time left logic ends
    $scope.assignedCheck = true;
    $scope.selectedUser=[];  
    
      $scope.assignedUserChecksChange = function (index) {
        $scope.selectedUser.push($scope.employeesAsigned[index]); 
        $scope.employeesAsigned.splice(index,1) ;
        $scope.assignedCheck = false;
      };

    $scope.displayUserList = false;
    $scope.onfocusfun = function () {
      $scope.displayUserList = true;
    };



    $scope.undoSelected =function(index){
      $scope.employeesAsigned.push($scope.selectedUser[index]); 
      $scope.selectedUser.splice(index,1); 
    } 

    //create Project Starts

    $scope.errorHandlingObject = {
      showError: false,
      createProjectLoader: true,
    };
    $scope.resetFunction = function () {
      $scope.searchQuery = "";
      $scope.displayUserList = false;
      $scope.createProjectObject = {
        assignedTo: [],
      };
      $scope.employeesAsigned= $scope.employeesAsignedStore ; 
      $scope.projectManager = {};
      $scope.assignedCheck = true;
      $scope.selectedUser=[]; 
    };

    $scope.projectManagerChange = function (managerDetails) {
      $scope.projectManger = {
        projectMangerId: JSON.parse(managerDetails)._id,
        name: JSON.parse(managerDetails).firstName,
        username: JSON.parse(managerDetails).username,
      };
    };
 
    $scope.ProjectFormDetails = function ($event) {
      $event.preventDefault();
      adminFactory.projectValidation($scope.createProjectObject , $scope.selectedUser, function(valid,createProjectObject ){
        if(valid){
          $scope.errorHandlingObject.createProjectLoader = false;
          adminServices.creatingPorject(createProjectObject,$scope.projectManger,
            function (data) {
              if (data.status == 404) {
                $scope.errorHandlingObject.showError = true;
                $scope.errorHandlingObject.createProjectLoader = true;
              } else {
                $scope.resetFunction(); 
                $scope.errorHandlingObject = {
                  showError: false,
                  createProjectLoader: true,
                };
                $scope.project.pop();
                $scope.project.unshift(data.data);
                $(function () {
                  $("#myModal2").modal("hide");
                });
                alert("Project created");
              }
            }
          );
        }else{
          alert("enter the valid date") ; 
        }
      })
    };

    //create project Ends

    function formatDateForInputDate(date) {
     return managerFactory.formatDateForInputDate(date); 
    }

    $scope.editProject = function (
      projectId,
      projectName,
      priority,
      StartDateValue,
      EndDateValue,
      index
    ) {
      $scope.projectId = projectId;
      $scope.updatedIndex = index;
      $scope.updateProjectObject = {
        projectName,
        priority,
        startDate: undefined,
        endDate: undefined,
      };

      $scope.projectPresent = false;
      $scope.EndDate = formatDateForInputDate(new Date(EndDateValue));
      $scope.StartDate = formatDateForInputDate(new Date(StartDateValue));
    };
    $scope.projectPresent = false;
    $scope.updateFormSubmit = function ($event) {
      $event.preventDefault();
      adminServices.updateProject($scope.updateProjectObject,$scope.projectId,token,
        function (response) {
          if (response.status == 204) {
            $scope.projectPresent = true;
          } else {
            $window.alert("Project Updated");
            $(function () {
              $("#myModal3").modal("hide");
            });
           adminFactory.updateFrontEnd($scope.project  ,$scope.updateProjectObject ,
             $scope.updatedIndex , function(project){
            $scope.project = project ; 
           })
            $scope.timeleft($scope.updateProjectObject.endDate);
            $scope.getDaysDiff(
              $scope.updateProjectObject.startDate,
              $scope.updateProjectObject.endDate
            );
          }
        }
      );
    };

    var numberOfPages = function (count) {
      $scope.pageSize = 8;
      $scope.totalPages = Math.ceil(count / $scope.pageSize);
      $scope.pages = [];
      for (var i = 1; i <= $scope.totalPages; i++) {
        $scope.pages.push(i);
      }
    };

    $scope.currentPage = 1;
    $scope.showNoProject = false;
    var fetchProjectsFunction = function (currentPage, filterObject) {
      $scope.project = [];
      $scope.allProjectDetailsLoader = false;
      adminServices.fetchProjects(
        filterObject,
        { token, currentPage },
        function (response) {
          $scope.allProjectDetailsLoader = true;
          var data = response.data;
          $scope.project = data.projectList;

          if ($scope.project.length == 0) {
            $scope.showNoProject = true;
          } else {
            $scope.showNoProject = false;
          }
          numberOfPages(data.projectCount);
        }
      );
    };
    fetchProjectsFunction($scope.currentPage, $scope.filterObject);
    $scope.setPage = function (pageNumber) {
      $scope.currentPage = pageNumber;
      fetchProjectsFunction($scope.currentPage, $scope.filterObject);
    };

    var debounceTimer;
    $scope.searchProjectFunction = function (projectNameValue) {
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        $scope.allProjectDetailsLoader = false;
        $scope.project = [];
        $scope.showNoProject = false;
        adminServices.searchProject(projectNameValue, function (response) {
          $scope.allProjectDetailsLoader = true;
          $scope.project = response.data;
          numberOfPages($scope.project.length);
          if (response.data.length == 0) {
            $scope.showNoProject = true;
          } else {
            $scope.showNoProject = false;
          }
        });
      }, 800);
    };

    $scope.filterSubmitForm = function ($event) {
      if (
        $scope.filterObject.createdStartDateFilter <=
        $scope.filterObject.createdEndDateFilter
      ) {
        $scope.showNoProject = false;
        $event.preventDefault();
        fetchProjectsFunction($scope.currentPage, $scope.filterObject);

        $(function () {
          $("#filterModal").modal("hide");
        });
      } else {
        alert("Invalid Date Input");
      }
    };

    $scope.deleteProject = function (projectId, index) {
     adminServices.deleteProject(projectId,  function(response){
      $scope.project.splice(index, 1) ;  
      alert("project Deleted")
     })
    };
    $scope.formReset = function () {
      $scope.filterObject = {
        priorityFilter: null,
        createdStartDateFilter: null,
        createdEndDateFilter: null,
        startDateFilter: null,
        endDateFilter: null,
      };
    };
  }
);
