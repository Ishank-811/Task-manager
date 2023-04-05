myApp.controller(
    "managerProjectDetailsController",
    function ($scope ,$stateParams, managerServices , employeeServices,  managerFactory) {
        
      var token = sessionStorage.getItem("token");
      $scope.totalEmployees = JSON.parse(localStorage.getItem('myData')); 

       
        
          managerServices.fetchProjectDetail($stateParams.projectId,$scope.totalEmployees , 
            function(employeesAsignedFiltered , projectData , ticketsData , progressPercentage){
            $scope.projectDetails = projectData;
            $scope.progressPercentage =progressPercentage
            $scope.employeesOfProject =  ticketsData ;
            $scope.employeesAsignedFiltered =employeesAsignedFiltered  ;
          })




      $scope.commentObject = {
        comments:[],
        showNoComments:"",
      }
      $scope.viewComments = function (ticketId) {
        $scope.ticketIdForComment = ticketId; 
        employeeServices.viewComments( ticketId, function (data) {
          if (data.length <= 0) {
            $scope.commentObject = {
              comments:[], 
              showNoComments : "No Comments"
            } 
          } else {
            $scope.commentObject = {
              comments:data, 
              showNoComments : ""
            } 
          }
        });
      };


      $scope.employeeDetails=[] ; 
      $scope.assignTask = function(assignedUserId , name, username){
        $scope.nameForModal = name ; 
        $scope.employeeDetails.push({
          assignedUserId,
          name,
          username
        });
      }
      $scope.addTaskObject = {
        taskeEmployeesAssigned:[],
      }
      $scope.addTaskFunction = function ($event) {
        $event.preventDefault();
        console.log(managerFactory); 
        managerFactory.addTaskFunctionValidation($scope.addTaskObject ,$scope.employeeDetails  , function(valid , addTaskObject){
        if(valid){
            managerServices.addTasks(addTaskObject ,$scope.projectDetails,token , function (response) {
              alert("Task Assigned");
              $scope.addTaskObject.taskeEmployeesAssigned=[]; 
              $scope.employeeDetails=[] ; 
              $scope.getTasksObject.showNoTaskAssigned=true, 
              $scope.getTasksObject.viewTask.push(response.data); 
            });
          }else{
            alert("Enter the valid Date") ; 
          }
    })
  }


      $scope.getTasksObject = {
        showNoTaskAssigned:true, 
        viewTask:[]
      }
        $scope.getTasks = function (userId) {
          $scope.showNoTaskAssigned=true; 
          managerServices.viewAssignedTask(userId,$stateParams.projectId, function (viewTask) {
            if (viewTask.length == 0) {
              $scope.getTasksObject = {
                showNoTaskAssigned:false, 
                viewTask:[]
              }
            } else {
              $scope.getTasksObject = {
                showNoTaskAssigned:true, 
                viewTask:viewTask
              }
            }
          });  
          };



          function formatDateForInputDate(date) {
           return managerFactory.formatDateForInputDate(date)
          }



          $scope.taskDetails = function (taskId ,updatedTaskName  ,updatedTaskDescription , EndDateValue ,StartDateValue, index ) {
            $scope.updateTaskObject = {
              taskId,
              updatedTaskName,
              updatedTaskDescription,
              EndDateValue:formatDateForInputDate(new Date(EndDateValue)),
              StartDateValue:formatDateForInputDate(new Date(StartDateValue)),
              index,
            }  
          };
          $scope.updateTaskFunction = function ($event) {
            $event.preventDefault();
            if($scope.updatedEndDate!=undefined){
              $scope.updateTaskObject['EndDateValue']=$scope.updatedEndDate;
            }
            if($scope.updatedStartDate!=undefined){
              $scope.updateTaskObject['StartDateValue']=$scope.updatedStartDate;
            }
            managerServices.updateTask($scope.updateTaskObject, function (response) {
              $scope.getTasksObject.viewTask[$scope.updateTaskObject.index]=response
              $(function () {
                $("#myModal").modal("hide");
              });
              alert("Task updated");
              $scope.updateTaskObject = {}
            });
          };



          $scope.addCommentsFormSubmit = function ($event) {
            $event.preventDefault(); 
            employeeServices.addComment( $scope.addComments , $scope.ticketIdForComment,token, function (response) {
              $scope.commentObject.comments.push(response);
              alert("Comment submitted");
              $(function () {
                $("#commentModal").modal("hide");
              });
              $scope.commentObject.showNoComments="", 
              $scope.addComments = "";
             
            });
          };



          $scope.deleteTask=  function(taskId, index){
            if (confirm("Want to delete this task ?") == true) {
            managerServices.deleteTask(taskId , function(){
              $scope.getTasksObject.viewTask.splice(index,1);
            }) 
            }
          }


          $scope.isSelected = false; 
          $scope.projectStatusChangeFunction = function(){
            $scope.isSelected = true ;
          }

          $scope.projectstatusFunction = function(status , projectId){
          managerServices.projectStatusUpdate(status , projectId,  function(){
            alert("status updated"); 
            $scope.isSelected = false;
          })
          }



    });  