myApp.controller(
  "ticketDetailsController",
  function ($scope, $stateParams, $window, employeeServices) {
    var token = sessionStorage.getItem("token");
    if (token) {


      
      employeeServices.viewTicket( 
         $stateParams.id, token ,
        function (ticketDetails , progressPercentage) {
          $scope.ticketDetails = ticketDetails;
          $scope.progressBar = progressPercentage;
          $scope.progressBarStore = progressPercentage;
        }
      ); 
      


      $scope.updateStatusLoader = true;
      $scope.progressSubmitFunction = function () {
        $scope.updateStatusLoader = false; 
        employeeServices.updatingStatus( $scope.progressBarStore,
          $stateParams.id , $scope.progressStatus , $scope.ticketDetails._id,token, function (status) {
          $scope.ticketDetails.status = status;
          $scope.updateStatusLoader = true;
          alert("status updated");
          if($scope.progressStatus=='completed'){
            $scope.progressBar=100; 
          }
          $scope.progressStatus = "";
        });
      };


      $scope.viewComments = function () {
        employeeServices.viewComments(
           $scope.ticketDetails._id ,
          function (response) {
            if (response.length <= 0) {
              $scope.showNoComments = "No Comments";
            } else {
              $scope.comments = response;
              $scope.showComments = false; 
            }
          }
        ); 
      };


      $scope.CommentLoader = true;
      $scope.addFileFormSubmit = function () {
        var formData = new FormData();
        formData.append("file", $scope.formData.file);
        employeeServices.uploadFileToUrl(formData ,$scope.ticketDetails._id , token, function () {});
      };




      $scope.ProgressLoader = true;
      $scope.addProgressFormSubmit = function () {
        $scope.ProgressLoader = false;
        employeeServices.updateProgress($scope.progressBar , $scope.progressBarStore,
           $scope.ticketDetails._id ,$stateParams.id , function (progress) {
          alert("Progress Updated");
          $scope.progressBar = progress;
          $scope.progressBarStore = progress;
          $scope.ProgressLoader = true;
          if ($scope.progressBar == 100) {
            $scope.ticketDetails.status = "completed";
          } else {
            $scope.ticketDetails.status = "inProgress";
          }
        });
      };




      $scope.viewAssignedTask = function () {
        employeeServices.viewAssignedTask($stateParams.id ,token , function (response) {
          if (response.length == 0) {
            $scope.showNoTaskAssigned = "No task Assigned";
          } else {
            $scope.viewTask = response;
            $scope.showNoTaskAssigned = "";
          }
        });
      };



      $scope.taskStatusChangeFunction = function (index) {
        $scope.isSelected = index;
      };
      $scope.taskStatusFunction = function (taskStatus, taskId) {
        employeeServices.taskStatusUpdate(taskStatus ,taskId, function () {
          alert("Task Status Updated");
          $scope.isSelected = "";
        });
      };




      $scope.addCommentsFormSubmit = function () {
        $scope.CommentLoader = false;
        employeeServices.addComment($scope.addComments ,$scope.ticketDetails._id ,token ,function () {
          $scope.CommentLoader = true;
          alert("comment added");
          $scope.showComments = false;
          $scope.addComments = "";
        });


      };
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
