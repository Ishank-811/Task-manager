myApp.controller(
    "managerProjectDetailsController",
    function ($scope ,$stateParams, managerServices , employeeServices) {
        



        var token = sessionStorage.getItem("token");
        $scope.totalEmployees = JSON.parse(localStorage.getItem('myData')); 
        var storingArray = [];
        $scope.employeesAsignedFiltered = [];
          managerServices.fetchProjectDetail($stateParams.projectId , function(response){
            var data=response.data; 
            $scope.projectDetails = data.projectData;
            $scope.progressPercentage =(($scope.projectDetails.progress.percentage)/($scope.totalEmployees.length)).toFixed(1);
            $scope.employeesOfProject =  data.ticketsData  ;
            storingArray = $scope.employeesOfProject.map(function (element) {
              return element.user.userId;
            }); 
            $scope.employeesAsignedFiltered = $scope.totalEmployees.filter(function (
              element
            ) {
              return !storingArray.includes(element.assignedTo.assignedUserId);
            });
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
        taskName:"" , 
        taskDescription:"",
        taskeEmployeesAssigned:[],
        startDate:"",
        endDate:"",
      }
      $scope.addTaskFunction = function ($event) {
        $event.preventDefault();
        if (Date.now() <= $scope.addTaskObject.startDate && Date.now() <= $scope.addTaskObject.endDate) {
          if ($scope.addTaskObject.startDate <= $scope.addTaskObject.endDate) {
            $scope.addTaskObject['taskeEmployeesAssigned'] = $scope.employeeDetails ; 
            managerServices.addTasks($scope.addTaskObject ,$scope.projectDetails,token , function (response) {
              alert("Task Assigned");
              $scope.addTaskObject = {
                taskName:"" , 
                taskDescription:"",
                taskeEmployeesAssigned:[],
                startDate:"",
                endDate:"",
              }
              $scope.employeeDetails=[] ; 
              $scope.getTasksObject.showNoTaskAssigned=true, 
              
              $scope.getTasksObject.viewTask.push(response.data); 
            });
          } else {
            alert("Enter the valid Date");
          }
        } else {
          alert("Enter the valid Date");
        }
      };








  
     
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
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            return year + "-" + month + "-" + day;
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
              $scope.getTasksObject.viewTask[$scope.updateTaskObject.index]=response.data
              
              alert("Task updated");
              $scope.updateTaskObject = {
                taskId:"",
                updatedTaskName:"",
                updatedTaskDescription:"",
                EndDateValue:"",
                StartDateValue:"",
                index:""
              }
             
            });
          };



          $scope.addCommentsFormSubmit = function ($event) {
            $event.preventDefault(); 
            employeeServices.addComment( $scope.addComments , $scope.ticketIdForComment,token, function (response) {
              $scope.commentObject.comments.push(response.data);
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
            managerServices.deleteTask(taskId , function(response){
              $scope.getTasksObject.viewTask.splice(index,1);

            }) 
            }
          }

          $scope.isSelected = false; 
          $scope.projectStatusChangeFunction = function(){
            $scope.isSelected = true ;
          }
          $scope.projectstatusFunction = function(status , projectId){
          managerServices.projectStatusUpdate(status , projectId,  function(response){
            alert("status updated"); 
            $scope.isSelected = false;
          })
          }



    });  