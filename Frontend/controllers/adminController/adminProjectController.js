myApp.controller("adminProjectController" , function($scope ,$timeout ,$window,  adminServices){
    var token = sessionStorage.getItem("token");
    


    $scope.filterObject = {
      priorityFilter:null,
      createdStartDateFilter:null,
      createdEndDateFilter:null,
      startDateFilter:null ,
      endDateFilter:null
     } 
    

//time left logic starts

      $scope.getDaysDiff = function(startDate, endDate) {
        var startTimestamp = Date.parse(startDate);
        var endTimestamp = Date.parse(endDate);
        var diff = endTimestamp - startTimestamp;
        return Math.round(diff / 86400000); // Convert milliseconds to days
      }
      $scope.timeleft=  function(endDate){
      var today = new Date();
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - today.getTime();
      return Math.round(diff / 86400000);
      }
//time left logic ends
$scope.assignedCheck=true ; 
$scope.assignedUserChecksChange = function(){
  $scope.assignedCheck=false  ; 
}

$scope.displayUserList=false ; 
$scope.onfocusfun = function () {
  $scope.displayUserList  = true ; 
}; 

//create Project Starts
  



$scope.createProjectObject = {
  projectName:"",
  priority:"", 
  startDate:"", 
  endDate:"",
  projectDescription:"",
  assignedTo:[],
  assignedUserChecks:[]
  }
  $scope.projectManger = {
    projectMangerId:"",
    name:"",
    username:"",
  };
    $scope.employeeObject = {
    employees : [],
    employeeList : []
  }
  $scope.errorHandlingObject  = {
    showError : false ,  
    createProjectLoader:true,
  }
  $scope.createProjectModalFunction = function(){
    $scope.searchQuery=""; 
    $scope.displayUserList  = false ; 
    $scope.createProjectObject = {
      projectName:"",
      priority:"", 
      startDate:"", 
      endDate:"",
      projectDescription:"",
      assignedTo:[],
      assignedUserChecks:[]
      }
      $scope.projectManager="";
      $scope.assignedCheck=true ; 
  }
  $scope.projectManagerChange = function (managerDetails) {
    $scope.projectManger={
     projectMangerId : JSON.parse(managerDetails)._id,
    name : JSON.parse(managerDetails).firstName,
    username : JSON.parse(managerDetails).username
    }
    
  };
  
      $scope.ProjectFormDetails = function ($event) {
        $event.preventDefault();
        if (Date.now() <= $scope.createProjectObject.startDate && Date.now() <= $scope.createProjectObject.endDate) {
          $scope.errorHandlingObject.createProjectLoader = false;
          if ($scope.createProjectObject.startDate <= $scope.createProjectObject.endDate) { 

            $scope.createProjectObject.assignedUserChecks.forEach(function(userData) {
              if(userData !== undefined && userData !== null){
                $scope.employeeObject.employees.push({
                assignedUserId: userData._id,
                name: userData.firstName,
              username: userData.username,
             });
              }
            });
              $scope.createProjectObject['assignedTo'] = $scope.employeeObject.employees ;
            adminServices.creatingPorject($scope.createProjectObject ,$scope.projectManger , function (data) {
              if (data.status == 404) {
                $scope.errorHandlingObject.showError = true;
                $scope.errorHandlingObject.createProjectLoader = true;
              } 
              else { 
                $scope.createProjectObject = {
                  projectName:"",
                  priority:"",
                  startDate:"", 
                  endDate:"",
                  projectDescription:"",
                  assignedTo:[],
                  }
                  $scope.projectManger = {
                    projectMangerId:"",
                    name:"",
                    username:""
                  };
                  $scope.errorHandlingObject  = {
                    showError : false ,  
                    createProjectLoader:true,
                  }
                  $scope.employeeObject = {
                    employees : [],
                    employeeList : []
                  }
                $scope.project.pop();
                $scope.project.unshift(data.data);
                $(function () {
                  $("#myModal2").modal("hide");
                });
                alert("Project created");
               $scope.projectManager="";
               $scope.employeesAssigned="";  
              }
            });
          } else {
            alert("Enter the valid Date");
          }
        } else {
          alert("Enter the valid Date");
        } 
      };



//create project Ends





      function formatDateForInputDate(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
      }
      
      $scope.editProject=  function(projectId ,projectName,priority  ,StartDateValue, EndDateValue , index ){
        $scope.projectId = projectId ; 
        $scope.updatedIndex = index; 
        $scope.updateProjectObject = {
          projectName,
          priority,
         startDate:undefined,
         endDate:undefined,  
        }
     
        $scope.projectPresent = false ;
        $scope.EndDate=formatDateForInputDate(new Date(EndDateValue));
        $scope.StartDate=formatDateForInputDate(new Date(StartDateValue));
       
      }
      $scope.projectPresent = false ; 
      $scope.updateFormSubmit=  function($event){

        $event.preventDefault(); 
       adminServices.updateProject($scope.updateProjectObject ,$scope.projectId, token , function(response){
        if(response.status==204){
         
          $scope.projectPresent = true ; 
        }else{

        $window.alert("Project Updated"); 
        $(function () {
          $("#myModal3").modal("hide");
        });
        $scope.project[$scope.updatedIndex].projectName =  $scope.updateProjectObject.projectName ;
        $scope.project[$scope.updatedIndex].priority =  $scope.updateProjectObject.priority ;
        if($scope.updateProjectObject.startDate){
        $scope.project[$scope.updatedIndex].startDate =  $scope.updateProjectObject.startDate ;  
        }
        if($scope.updateProjectObject.endDate){
          $scope.project[$scope.updatedIndex].endDate =  $scope.updateProjectObject.endDate ;  
          }
          $scope.timeleft($scope.updateProjectObject.endDate); 
          $scope.getDaysDiff($scope.updateProjectObject.startDate , $scope.updateProjectObject.endDate)   
      }
        
        
 
       })
      }
 

      var numberOfPages = function(count){
        $scope.pageSize = 8;
          $scope.totalPages = Math.ceil(count/ $scope.pageSize);
          $scope.pages = [];
          for (var i = 1; i <= $scope.totalPages; i++) {
            $scope.pages.push(i);
          }
      }

      $scope.currentPage = 1;
      $scope.showNoProject = false  ;
      var fetchProjectsFunction = function (currentPage , filterObject) {
        $scope.project=[]; 
        $scope.allProjectDetailsLoader = false;
        adminServices.fetchProjects(filterObject,{ token, currentPage }, function (response) {
          $scope.allProjectDetailsLoader = true;
          var data = response.data ; 
          $scope.project = data.projectList;
 
          if($scope.project.length==0){
            $scope.showNoProject = true  ; 
          }else{
            $scope.showNoProject = false    ; 
          }
          numberOfPages(data.projectCount); 
         
        });
      };
      fetchProjectsFunction($scope.currentPage ,  $scope.filterObject);
      $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
        fetchProjectsFunction($scope.currentPage ,  $scope.filterObject);
      };






      var debounceTimer ;  
      $scope.searchProjectFunction  = function(projectNameValue){
        if (debounceTimer) {
          $timeout.cancel(debounceTimer);
        }
        debounceTimer = $timeout(function () {
          $scope.allProjectDetailsLoader = false;
          $scope.project=[]; 
          $scope.showNoProject = false  ;
          adminServices.searchProject(projectNameValue, function (response) {
            $scope.allProjectDetailsLoader = true;
            $scope.project = response.data;
            numberOfPages($scope.project.length); 
            if(response.data.length==0){
              $scope.showNoProject = true  ; 
            }else{
              $scope.showNoProject = false  ; 
            }
          });
        }, 800);
      }





     $scope.filterSubmitForm =  function($event){
      if($scope.filterObject.createdStartDateFilter <= $scope.filterObject.createdEndDateFilter ){
      $scope.showNoProject = false  ; 
      $event.preventDefault(); 
      fetchProjectsFunction($scope.currentPage ,  $scope.filterObject);
 
        $(function () {
          $("#filterModal").modal("hide");
        });
       
     }else{
      alert("Invalid Date Input")
     }     
    }
    $scope.formReset = function(){
      $scope.filterObject = {
        priorityFilter:null,
        createdStartDateFilter:null,
        createdEndDateFilter:null,
        startDateFilter:null ,
        endDateFilter:null
       }
     }


})