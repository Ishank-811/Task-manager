myApp.controller(
    "managerViewTaskListController",function($scope ,$timeout,  managerServices){

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
        managerServices.showAllAssignedProjects(currentPage,token, function(response){
          $scope.errorHandlingObject = {
            viewManagerDashBoardLoader: true,
            showNoProjectAssigned: false,
          };
            $scope.projectData= response.data.projectData; 
            $scope.managerId = response.data.projectData[0].projectManger.projectMangerId; 
            console.log($scope.managerId); 
            numberOfPages(response.data.countNum) ; 
        })
    }
    showProjectTaskFunction($scope.currentPage); 
        $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
        showProjectTaskFunction($scope.currentPage);
      };




        $scope.progressDivs  = ['Inactive' , 'Started' , 'working', 'completed'];
        function formatDateForInputDate(date) {
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            return year + "-" + month + "-" + day;
          }
          
        $scope.taskDetails = function (taskId ,updatedTaskName  ,updatedTaskDescription , EndDateValue ,StartDateValue ) {
          $('#viewTaskModal').addClass('show');
        
         



          
       

            $scope.updateTaskObject = {
              taskId,
              updatedTaskName,
              updatedTaskDescription,
              EndDateValue:formatDateForInputDate(new Date(EndDateValue)),
              StartDateValue:formatDateForInputDate(new Date(StartDateValue)),
            }
          };
        $scope.showProjectTask = function(projectName,projectId){
          $scope.projectName = projectName; 
            managerServices.showProjectTask(projectId,token, function(response){
            $scope.viewTask = response.data; 
            })
    }
        $scope.updateTaskFunction = function ($event) {
             
            $event.preventDefault();
            if($scope.updatedEndDate!=undefined){
              $scope.updateTaskObject['EndDateValue']=$scope.updatedEndDate;
            }
            if($scope.updatedStartDate!=undefined){
              $scope.updateTaskObject['StartDateValue']=$scope.updatedStartDate;
            }
            managerServices.updateTask($scope.updateTaskObject, function (response) {
                var indexToReplace = $scope.viewTask.findIndex(function(element){
                    return element._id == $scope.updateTaskObject.taskId
                });
                if (indexToReplace !== -1) {
                    $scope.viewTask.splice(indexToReplace, 1, response.data);
                  }
                  
               alert("Task updated");
              $(function () {
                $("#myModal").modal("hide");
              });
              $scope.updateTaskObject = {
                taskId:"",
                updatedTaskName:"",
                updatedTaskDescription:"",
                EndDateValue:"",
                StartDateValue:"",
             
              }
             
            });
          };









          $scope.deleteTask=  function(taskId, index){
            if (confirm("Want to delete this task ?") == true) {
           
            managerServices.deleteTask(taskId , function(response){
              $(function () {
                $("#myModal").modal("hide");
              });
              var indexToReplace = $scope.viewTask.findIndex(function(element){
                return element._id == taskId
            });
            if (indexToReplace !== -1) {
                $scope.viewTask.splice(indexToReplace, 1);
              }
       
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
        console.log(projectNameValue); 
        managerServices.searchProject(
          projectNameValue,
          $scope.managerId,
          function (response) {
            $scope.projectData = response.data;
            console.log($scope.projectData); 
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