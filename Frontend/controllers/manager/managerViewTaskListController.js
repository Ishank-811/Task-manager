myApp.controller(
    "managerViewTaskListController",function($scope , managerServices){

        var token = sessionStorage.getItem("token");

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
            $scope.projectData= response.data.projectData; 
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
            console.log($scope.updateTaskObject.taskId) ; 
           
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
              console.log(taskId); 
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
 
    }); 