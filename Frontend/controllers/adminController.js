myApp.controller("adminController", function ($scope, $window, adminServices) {
  var role = sessionStorage.getItem("role");
  var token = sessionStorage.getItem("token");

  if (role != undefined && role == "Admin") {
    $window.location.href = "#!/AdminDashboard";
  } else {
    $window.location.href = "#!/singinAsUsers";
  }
  $scope.project= [] ; 
  $scope.response = [];
  $scope.employeesAsigned = [];
  var array1 = [];
  adminServices.readingData(token, function (data) {
    if (data.data.role != "Admin") {
      $window.location.href = "#!/singinAsUsers";
    } else {
      $scope.employeesAsigned = data.data.userdata.filter(function (val) {
        return val.role == "Employee";
      });
      $scope.response = data.data.userdata.filter(function (val) {
        return val.role == "Manager";
      });
    }
  });

  var managerId, mangerName, managerUsername;
  $scope.projectManagerChange = function (value) {
    managerId = JSON.parse(value)._id;
    mangerName = JSON.parse(value).firstName;
    managerUsername = JSON.parse(value).username;
    console.log(managerId);
  };

  var employees = [];
  $scope.employeeList = [];
  var employeesAsignedFiltered = [];
  $scope.employeeListed = function (val) {
    employees.push({
      assignedUserId: JSON.parse(val)._id,
      name: JSON.parse(val).firstName,
      username: JSON.parse(val).username,
    });
    array1 = employees.map(function (element) {
      return element.assignedUserId;
    });
    console.log(array1);
    employeesAsignedFiltered = $scope.employeesAsigned.filter(function (
      element
    ) {
      return !array1.includes(element._id);
    });

    // $scope.employeesAsigned  = (employeesAsignedFiltered);

    $scope.employeeList.push(JSON.parse(val).username);
  };
  $scope.createProjectLoader = true ; 
  $scope.ProjectFormDetails = function ($event) {
    $event.preventDefault();

    if (Date.now() <= $scope.startDate && Date.now() <= $scope.endDate) {
      $scope.createProjectLoader = false ; 
      if ($scope.startDate <= $scope.endDate) {
        var projectDetails = {
          projectName: $scope.updatedFirstName,
          projectManger: {
            projectMangerId: managerId,
            name: mangerName,
            username: managerUsername,
          },
          assignedTo: employees,
          priority: $scope.priorityStatus,
          createdAt: new Date(),
          startDate: $scope.startDate,
          endDate: $scope.endDate,
        };
     
        adminServices.creatingPorject(projectDetails, function (data) {
       
          if (data.status == 404) {
            $scope.showError = true;
            $scope.createProjectLoader = true ; 
          } else {
            $scope.createProjectLoader = true ; 
            $scope.project.push(data.data); 
            alert("Project created");
            console.log(data); 
            $scope.updatedFirstName = "";
            $scope.projectManager = "";
            $scope.showError = false;
            $scope.employeeList = [];
            $scope.employeesAssigned = "";
            ($scope.priorityStatus = ""),
              (employees = []),
              ($scope.startDate = ""),
              ($scope.endDate = "");
          }
        });
      } else {
        alert("Enter the valid Date");
      }
    } else {
      alert("Enter the valid Date");
    }
  };

  $scope.deleteProject = function(val){
    console.log(val); 
  }
  $scope.selectedProjectId 
  $scope.selectEmployeeId 
  $scope.showProfile = function (projectId,   val) {
    // console.log(val);
    $scope.showEmployeeTicketTable=  true; 
    $scope.selectedProjectId = projectId ; 
    $scope.selectEmployeeId = val;  

console.log(projectId , val); 
    adminServices.viewProfile(val , function(response){
      console.log(response);
       $scope.employeeFirstName = response.data.firstName
       $scope.employeeLastName = response.data.lastName 
       $scope.employeeUsername  = response.data.username
       $scope.employeeRole = response.data.role
       $scope.employeeOrganization = response.data.organization.name
      
    })
    
  };
  $scope.showEmployeeTicketTable=  true; 
  $scope.showEmployeeTicket = function(){

  //  console.log( $scope.selectedProjectId  , $scope.selectEmployeeId) ; 
   const data = {
    projectId : $scope.selectedProjectId,  
    employeeId  : $scope.selectEmployeeId
   }
   adminServices.showEmployeeTicket(data , function(response){
    $scope.showEmployeeTicketTable=  false; 
    $scope.EmployeeticketDetails = (response.data); 
    
   })
  }

  $scope.allProjectDetailsLoader = false;       
  
    adminServices.fetchProjects(token, function (data) {
      $scope.allProjectDetailsLoader = true;   
      $scope.project = (data.data);
    });


});
