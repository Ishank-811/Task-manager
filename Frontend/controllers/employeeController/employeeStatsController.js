myApp.controller(
  "employeeStatsController",
  function ($scope, employeeServices) {
    var token = sessionStorage.getItem("token");
    var dayWiseChart;

    $scope.viewProjectProgress = function (projectId) {
      employeeServices.viewTicket(projectId, token, function (response) {
        $scope.ticketProgress = response;
      });
    };

    $scope.monthWiseAnalysis = function (currentMonthValue) {
      employeeServices.employeeStatistics(
        currentMonthValue,
        token,
        function (taskcompletedDayWise) {
        
          if (dayWiseChart) {
            dayWiseChart.destroy();
          }

          dayWiseChart = new Chart("line", {
            type: "line",
            data: {
              labels: taskcompletedDayWise.dates,
              datasets: [
                {
                  label: "Number of task completed this month",
                  data: taskcompletedDayWise.createdData,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  stacked: true,
                },
              },
            },
          });
        }
      );
    };
    $scope.monthWiseAnalysis("03");
    $scope.monthChangeFunction = function (monthValue) {
      $scope.monthWiseAnalysis(monthValue);
    };

    employeeServices.employeeStats(
      token,
      function (countTheProjects, upcomingProjects, overdueProjects) {
        $scope.statistics = {countTheProjects, upcomingProjects, overdueProjects}; 
      }
    );

    employeeServices.progressProject(token, function (progressProject) {
      new Chart("barchart", {
        type: "bar",
        data: {
          labels: progressProject.projectName,
          datasets: [
            {
              label: "Highest Progress project this month",
              data: progressProject.projectProgress,
              backgroundColor: [
                "rgba(255, 99, 132)",
                "rgba(255, 159, 64)",
                "rgba(255, 205, 86)",
                "rgba(75, 192, 192)",
                "rgba(54, 162, 235)",
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    });
  }
);
