myApp.controller("updateProjectDetailsController"  , function($scope, $stateParams ,$window, updateProjectDetailsServices){
    
    $scope.message = "Hello"; 

    var employeesAsignedFiltered=[];
    var array1 = [];  
    $scope.updateAssignedEmployee=[] ;
   updateProjectDetailsServices.readingdata($stateParams.id , function(data){
      
        array1 = data.data.assignedTo.map(function(element){
            return element.assignedUserId ; 
        })
        console.log(array1);
        console.log($scope.employeesAsigned) 
        employeesAsignedFiltered =  $scope.employeesAsigned.filter(function(element){ 
            return !array1.includes(element._id) ; 
        })
        console.log(employeesAsignedFiltered);

        $scope.employeesAsigned =employeesAsignedFiltered ;
        
        // console.log(data.data.assignedTo.length); 
        $scope.updateAssignedEmployee = data.data.assignedTo
        $scope.updatedProjectName = data.data.projectName ; 
        $scope.managerUsername = data.data.projectManger.username;
    })
    $scope.allEmployeesChanged= true; 
    $scope.employeeAddedChange =function(val){
        console.log(JSON.parse(val)); 
        $scope.allEmployeesChanged = false; 
    }

    $scope.deleteAssingedUser = function(userId){
        
        // console.log(data.data.assignedTo.length); 
        if($scope.updateAssignedEmployee.length<=1){
            $window.alert("add more users to delete") ; 
        }
        else{
        var data = {
            userId :userId.assignedUserId,  
            projectId:  $stateParams.id
        }
        updateProjectDetailsServices.deleteuser(data , function(response){
            alert("Employee deleted"); 
            console.log(response); 
        })
    }
    }

    $scope.addEmployeesSubmit = function(){
       
    var userDetails = JSON.parse($scope.employeeAdded); 
       
        var data = {

            projectId:  $stateParams.id ,
            userDetails 
        }
        updateProjectDetailsServices.addEmployees(data, function(response){
            console.log(response); 
            alert("employee added") ; 
        })
    } 

    }); 
    