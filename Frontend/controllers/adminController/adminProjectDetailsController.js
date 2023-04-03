myApp.controller(
  "adminProjectDetailsController",
  function (
    $scope,
    $stateParams,
    adminServices,
    managerServices,
    updateProjectDetailsServices
  ) {
    var token = sessionStorage.getItem("token");

    $scope.object = {
      allEmployeesChanged: true,
      showNoTaskAssigned: true,
      showInformation: false,
      showstatusLoader: true,
      viewTask: "",
    };

    $scope.employeeAddedChange = function () {
      $scope.object.allEmployeesChanged = false;
    };




    //time left logic starts

    $scope.getDaysDiff = function (startDate, endDate) {
      var startTimestamp = Date.parse(startDate);
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - startTimestamp;
      return Math.round(diff / 86400000); // Convert milliseconds to days
    };
    $scope.timeleft = function (endDate) {
      var today = new Date();
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - today.getTime();
      return Math.round(diff / 86400000);
    };
    //time left logic ends






    
    $scope.employeesOfProject = [];
    $scope.employeesAsignedFiltered = [];
    var storingArray = [];
    $scope.loaderObject = {
      projectSpecificationLoader: false,
      showprojectSpecification: true,
    };




    adminServices.fetchProjectDetails(
      $stateParams.projectId,
      token,
      function (response) {
        var data = response.data;
        $scope.employeesOfProject = data.usersData;
        $scope.projectDetails = data.projectData;
        $scope.loaderObject = {
          projectSpecificationLoader: true,
          showprojectSpecification: false,
        };
        storingArray = data.usersData.map(function (element) {
          return element.assignedTo.assignedUserId;
        });
        $scope.employeesAsignedFiltered = $scope.employeesAsigned.filter(
          function (element) {
            return !storingArray.includes(element._id);
          }
        );
      }
    );







    $scope.viewAssignedTask = function (userId, projectId) {
      $scope.object.viewTask = "";
      $scope.object.showNoTaskAssigned = true;
      managerServices.viewAssignedTask(userId, projectId, function (response) {
        if (response.data.length == 0) {
          $scope.object.showNoTaskAssigned = false;
          $scope.object.viewTask = "";
        } else {
          $scope.object.viewTask = response.data;
          $scope.object.showNoTaskAssigned = true;
        }
      });
    };






    $scope.employeeProjectStatus = function (projectId, employeeDetails) {
      $scope.object.showstatusLoader = false;
      $scope.object.showInformation = false;
      $scope.object.viewTask = "";
      adminServices.viewTicket(
        projectId,
        employeeDetails.assignedUserId,
        function (response) {
          $scope.object.showstatusLoader = true;
          $scope.object.showInformation = true;
          $scope.object.viewTask = "";
          $scope.employeeProjectStatusDetails = response.data;
        }
      );
    };








    $scope.addEmployeesSubmit = function ($event) {
      $event.preventDefault();
      var userDetails = JSON.parse($scope.employeeAdded);
      updateProjectDetailsServices.addEmployees(
        $scope.projectDetails,
        userDetails,
        function (response) {
          $scope.employeesOfProject.push(response.data);
          alert("employee added to the project");
          $(function () {
            $("#myModal3").modal("hide");
          });
          $scope.employeeAdded = "";
          $scope.object.allEmployeesChanged = true;
        }
      );
    };







    $scope.deleteAssingedUser = function(projectId,  userId ,firstName, index){
      if($scope.employeesOfProject.length>1){
      adminServices.deleteuser(projectId,  userId  , function(){
       alert("employee Deleted"); 
       $(function () {
        $("#myModal3").modal("hide");
      });
       $scope.employeesOfProject.splice(index, 1);  
       $scope.employeesAsignedFiltered.push({firstName, _id:userId}) ; 
       
      })
      }else{
        alert("Add more employee to delete this user") ; 
      }
      
    }
  }
);
