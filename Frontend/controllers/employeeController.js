myApp.controller("employeeController"  , function($scope  , $window ,  employeeServices){
    
    var role  = sessionStorage.getItem("role");
    var token = sessionStorage.getItem("token"); 
    if(role=="Employee"){
        $window.location.href= "#!/EmployeeDashboard";
        employeeServices.readingdata(token , function(data){
            $scope.todayDate = new Date();
            $scope.employeeId = data.data.userid ;      
            $scope.response = (data.data.projectDetails); 
          
         $scope.startTicketMessage = "Start Ticket" 
        //  $scope.hideLoader = true ;   
        $scope.startTicket =function(value){
            
           console.log(value); 
            var data  = {
                token , 
                projectId : value._id , 
                projectManagerId:value.projectManger.projectMangerId,
                projectName:value.projectName,
                projectManagerUsername:value.projectManger.username,
                projectManagerName:value.projectManger.name , 
                createdAt:new Date(),
                priority:value.priority
                
            }
            // $scope.startTicketMessage = "Starting Ticket"  
            // $scope.hideLoader = false ; 
            employeeServices.addTicket(data, function(response){
                console.log(response); 
                alert("ticket has been initiaited"); 
                // $scope.hideLoader = true ; 
              $scope.response.forEach(element => {
                    if(element._id==value._id){
                        element.assignedTo.forEach(function(secondIterate){
                          if(secondIterate.assignedUserId == response.data.employeeId){
                            secondIterate.isStarted=true ; 
                          }          
                        })
                    }
                });
                // $scope.startTicketMessage = "Created" 
                // $scope.response
            }); 

        }

            // $scope.viewTicket =function(val){
                // console.log(val); 
                
                // var data  = {
                //     token , 
                //     _id:val._id
                // }
                //     employeeServices.viewTicket(function(data, response){
                //         console.log(response); 
                    // }); 
            // }

        })
    }else{
        $window.location.href= "#!/singinAsUsers"; 
    }
    $scope.message = "employee view" 
    

}); 