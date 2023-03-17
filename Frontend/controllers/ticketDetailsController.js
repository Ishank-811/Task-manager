myApp.controller(
  "ticketDetailsController",
  function ($scope, $stateParams, $window, employeeServices) {
    var token = sessionStorage.getItem("token");
    $scope.ticketId;
    if (token) {
      console.log($stateParams.id);
      employeeServices.viewTicket(
        { projectId: $stateParams.id, token },
        function (response) {
          $scope.status = response.data.status;
          $scope.projectManagerName = response.data.project.projectManagerName;
          $scope.projectName = response.data.project.ProjectName;
          $scope.priority = response.data.priority;
          $scope.ticketId = response.data._id;
          // console.log(response.data.progress.percentage);

          $scope.progressBar = response.data.progress.percentage;
          $scope.progressBarStore = response.data.progress.percentage;
        }
      );
      $scope.updateStatusLoader = true;
      $scope.updateTagMessage = "Update Tag";
      $scope.progressSubmitFunction = function ($event) {
        console.log($scope.progressStatus);
        $scope.updateStatusLoader = false;
        $scope.updateTagMessage = "Updating Tag";
        var data = {
          projectStatus: $scope.progressStatus,
          ticketId: $scope.ticketId,
        };

        employeeServices.updatingStatus(data, function (response) {
          console.log(response);
          $scope.status = response.data.status;
          $scope.updateStatusLoader = true;
          $scope.updateTagMessage = "Update Tag";
          alert("status updated");
          $scope.progressStatus = "";
        });
      };

      $scope.viewComments = function (val) {
        employeeServices.viewComments(
          { ticketId: $scope.ticketId },
          function (data) {
            console.log(data);
            if (data.data.length <= 0) {
              $scope.showNoComments = "No Comments";
            } else {
              $scope.comments = data.data;
              $scope.showComments = false;
              $scope.ticketId = data.data._id;
            }
          }
        );
      };
      $scope.CommentLoader = true;
      $scope.addFileFormSubmit = function () {
        var file = $scope.formData.file;
        console.log("file is ");
        console.log(file);
        var formData = new FormData();
        var data = {
          formData,
          ticketId: $scope.ticketId,
          token,
        };
        formData.append("file", $scope.formData.file);
        var uploadUrl = "/fileUpload";
        employeeServices.uploadFileToUrl(data, function (response) {
          console.log(response);
        });
      };

      $scope.ProgressLoader = true;
      $scope.addProgressFormSubmit = function () {
        console.log($scope.progressBar);

        $scope.ProgressLoader = false;
        var data = {
          progressBar: $scope.progressBar,
          progressBarDiff: $scope.progressBar - $scope.progressBarStore,
          ticketId: $scope.ticketId,
          projectId: $stateParams.id,
        };
        employeeServices.updateProgress(data, function (response) {
          alert("Progress Updated");
          $scope.progressBar = response.data.progress.percentage;
          $scope.progressBarStore = response.data.progress.percentage;
          $scope.ProgressLoader = true;
          if ($scope.progressBar == 100) {
            $scope.status = "completed";
          } else {
            $scope.status = "inProgress";
          }
        });
      };

      $scope.viewAssignedTask = function () {
        var data = {
          projectId: $stateParams.id,
          token,
        };
        employeeServices.viewAssignedTask(data, function (response) {
          console.log(response);
          if (response.data.length == 0) {
            $scope.showNoTaskAssigned = "No task Assigned";
          } else {
            $scope.viewTask = response.data;
            $scope.showNoTaskAssigned = "";
          }
        });
      };

      $scope.taskStatusChangeFunction = function (index) {
        $scope.isSelected = index;
      };
      $scope.taskStatusFunction = function (taskStatus, taskId) {
        var data = {
          taskStatus,
          taskId,
        };
        employeeServices.taskStatusUpdate(data, function (response) {
          console.log(response);
          alert("Task Status Updated");
          $scope.isSelected = "";
        });
      };

      $scope.addCommentsFormSubmit = function () {
        $scope.CommentLoader = false;
        var data = {
          comments: $scope.addComments,
          ticketId: $scope.ticketId,
          token,
        };

        employeeServices.addComment(data, function (response) {
          $scope.CommentLoader = true;
          alert("comment added");
          $scope.addComments = "";
        });
      };
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
