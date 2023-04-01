myApp.controller(
    "employeeTaskListController",function($scope , employeeServices){
      
        $scope.filterObject= {status:'Inactive'}; 
        $scope.searchFilterInTask= function(filterValue){
           $scope.filterObject.status = filterValue ; 
           $scope.allTasks =  $scope.storeVariable ; 
           console.log($scope.filterObject) ; 
        }
        $scope.endDateFilter=  function(){
            $scope.filterObject= {}; 
            $scope.allTasks = $scope.allTasks.filter(function(element){
            var endDate = new Date(element.endDate);
            return ((endDate <= new Date()) && element.status!='completed') ; 
           
         })

         console.log($scope.allTasks); 
        

        }   


        $scope.viewTaskDescription = function(taskName , taskDescription){
            $scope.taskName= taskName ; 
            $scope.taskDescription = taskDescription ; 
        }

        $scope.timeleft=  function(endDate){
            var today = new Date();
            var endTimestamp = Date.parse(endDate);
            var diff = endTimestamp - today.getTime();
            return Math.round(diff / 86400000);
            }
        var token = sessionStorage.getItem("token");
        employeeServices.getAllTasks(token , function(response){
            console.log(response); 
            $scope.allTasks = response ; 
            $scope.storeVariable=response ; 
        })

    }) ; 