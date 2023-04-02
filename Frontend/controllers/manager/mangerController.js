myApp.controller(
  "mangerController",
  function ($scope, $window, $timeout, managerServices, employeeServices) {
    var role = sessionStorage.getItem("role");
    $scope.username = sessionStorage.getItem("username");  
    $scope.organization = sessionStorage.getItem("organization"); 
    var token = sessionStorage.getItem("token");
    $scope.message = "Manager Dashboard";
    // console.log($scope.loggedOut) ; 

    if (role == "Manager") {
     
     
      $scope.hideticket = true;
      $scope.showManagerDashboard = true;
      $scope.ViewTicketLoader = true;
     
      // $window.location.href = "#!/MangerDashboard";



      
      $scope.showNoAnalysis = false;
      $scope.dateWiseAnalysis = function ($event) {
        if ($scope.startDateForAnalysis <= $scope.endDateForAnalysis) {
          var data = {
            startDate: $scope.startDateForAnalysis,
            endDate: $scope.endDateForAnalysis,
          };

          managerServices.dateWiseAnalysis(data, function (response) {
            if (response.data.length == 0) {
              $scope.analysis = response.data;
              $scope.showNoAnalysis = true;
            } else {
              $scope.analysis = response.data;
              $scope.showNoAnalysis = false;
            var inactiveNumber = 0;
            var completedNumber = 0;
            var workingNumber = 0;
            var startedNumber = 0;
            response.data.forEach((element) => {
              console.log(element.status) ;
              if (element.status == "Inactive") {
                inactiveNumber =element.count ;
              } else if (element.status == "completed") {
                completedNumber =element.count ;
              } else if (element.status == "working") {
                workingNumber = element.count;
              } else if (element.status == "started") {
                startedNumber = element.count;
              }
            });
            $timeout(function () {
              new Chart("pie-chart", {
                type: "pie",
                data: {
                  labels: ["Working", "Completed", "Inactive", "Started"],
                  datasets: [
                    {
                      label: "Population (millions)",
                      backgroundColor: [
                        "#5bf556",
                        "#ffc107",
                        "#dc3545",
                        "#6610f2",
                      ],
                      data: [
                        workingNumber,
                        completedNumber,
                        inactiveNumber,
                        startedNumber,
                      ],
                    },
                  ],
                },
                options: {
                  title: {
                    display: true,
                    text: "Task analysis ",
                  },
                },
              });
            }, 0);

            }
          });
        } else {
          alert("Enter the valid date");
        }
      };
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
