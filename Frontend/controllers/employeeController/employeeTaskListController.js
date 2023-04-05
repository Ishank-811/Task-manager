myApp.controller(
    "employeeTaskListController",function($scope , employeeServices){
        var token = sessionStorage.getItem("token");

        
        $scope.filterObject= {status:'Inactive'}; 
        $scope.searchFilterInTask= function(filterValue){
           $scope.filterObject.status = filterValue ; 
           $scope.allTasks =  $scope.storeVariable ; 
          
        }
        $scope.endDateFilter=  function(){
            $scope.filterObject= {}; 
            $scope.allTasks = $scope.allTasks.filter(function(element){
            var endDate = new Date(element.endDate);
            return ((endDate <= new Date()) && element.status!='completed') ; 
         })
        }   

        $scope.viewTaskDescription = function(taskName , taskDescription){
           $scope.taskDetailsForDescription = {taskName , taskDescription}
        }


        $scope.timeleft=  function(endDate){
            var today = new Date();
            var endTimestamp = Date.parse(endDate);
            var diff = endTimestamp - today.getTime();
            return Math.round(diff / 86400000);
            }
       
        employeeServices.getAllTasks(token , function(response){
            $scope.allTasks = response ; 
            $scope.storeVariable=response ; 
        })

    }) ; 