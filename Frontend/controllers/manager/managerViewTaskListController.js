myApp.controller(
    "managerViewTaskListController",function($scope ,$timeout,  managerServices, managerFactory){

        var token = sessionStorage.getItem("token");

        $scope.errorHandlingObject = {
          viewManagerDashBoardLoader: false,
          showNoProjectAssigned: false,
        };
        $scope.currentPage= 1  ;
        var numberOfPages = function(count){
            $scope.pageSize = 8;
              $scope.totalPages = Math.ceil(count/ $scope.pageSize);
              $scope.pages = [];
              for (var i = 1; i <= $scope.totalPages; i++) {
                $scope.pages.push(i);
              }
          }

        var showProjectTaskFunction = function(currentPage){
        managerServices.showAllAssignedProjects(currentPage,token, function(projectData , countNum){
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: false,
          };
            $scope.projectData= projectData; 
            if(projectData[0]){
            $scope.managerId = projectData[0].projectManger.projectMangerId; 
            }
            numberOfPages(countNum) ; 
        }) 
    }
       showProjectTaskFunction($scope.currentPage); 
        $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
        showProjectTaskFunction($scope.currentPage);
      };


      $scope.progressDivs  = ['Inactive' , 'Started' , 'working', 'completed'];
      $scope.showProjectTask = function(projectName,projectId){
        $scope.projectName = projectName; 
          managerServices.showProjectTask(projectId,token, function(response){
          $scope.viewTask = response.data; 
          })
          }



        
        $scope.taskDetails = function (taskDetails) {
          $('#viewTaskModal').addClass('show');
          managerFactory.updateTaskObjectFunction(taskDetails , function(updateTaskObject){
            $scope.updateTaskObject =updateTaskObject ; 
          })
          };

            $scope.updateTaskFunction = function ($event) {
            $event.preventDefault();
            managerFactory.updateTaskValidationForProject($scope.updateTaskObject , function(valid){
              if(valid){
                managerServices.updateTask($scope.updateTaskObject, function (response) {
                  managerFactory.updateTaskFrontEnd($scope.viewTask , $scope.updateTaskObject,response, function(viewTask){
                      alert("Task updated");
                      $(function () {
                        $("#myModal").modal("hide");
                      });
                      $scope.updateTaskObject = {}
                    $scope.viewTask = viewTask ;
                  })
                });
              }else{
                alert("Enter the valid Date"); 
              }
            })
         
          };



          $scope.deleteTask=  function(taskId, index){
            if (confirm("Want to delete this task ?") == true) {
            managerServices.deleteTask(taskId , function(){
              $(function () {
                $("#myModal").modal("hide");
              });
              managerFactory.updateDeleteFrontEnd($scope.viewTask,taskId,  function(viewTask){
                $scope.viewTask = viewTask ; 
              })
            }) 
            }
          }



    var debounceTimer;
    $scope.searchProjectFunction = function (projectNameValue) {
      $scope.errorHandlingObject.viewManagerDashBoardLoader = false;
      $scope.projectData=[]; 
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
       
        managerServices.searchProject(
          projectNameValue,
          $scope.managerId,
          function (response) {
            $scope.projectData = response;
            numberOfPages($scope.projectData.length);
            if ($scope.projectData.length == 0) {
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
 
    }); 