myApp.controller(
  "adminStatsController",
  function ($scope, $timeout, adminServices) {
    var token = sessionStorage.getItem("token");
    $scope.timeleft = function (endDate) {
      var today = new Date();
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - today.getTime();
      if (Math.round(diff / 86400000) >= 0) {
        return Math.round(diff / 86400000);
      } else {
        return -Math.round(diff / 86400000);
      }
    };
    var debounceTimer;
    var projectWiseChart;
    $scope.searchProjectFunction = function (projectNameValue) {
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        $scope.allProjectDetailsLoader = false;
        $scope.project = [];
        $scope.showNoProject = false;
        adminServices.searchProject(projectNameValue, function (response) {
          $scope.project = response.data;
        });
      }, 800);
    };

    $scope.statusFunctionOfProject = function (projectName, projectId,monthValue) {
      $scope.projectName = projectName;
      $scope.projectId = projectId;
      $scope.monthValue=monthValue ; 
      monthNum = parseInt(monthValue);
      adminServices.projectWiseAnalysis(
        projectId,monthValue,monthNum,
        function (projectWiseAnalysisObject  ) {
         
          
          if (projectWiseChart) {
            projectWiseChart.destroy();
          }
          projectWiseChart = new Chart("projectWiseAnalysis", {
            type: "line",
            data: {
              labels: projectWiseAnalysisObject.ProjectWisedates,
              datasets: [
                {
                  label: "Number of projects created this month",
                  data: projectWiseAnalysisObject.ProjectWiseData,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
                {
                  label: "Number of projects completed this month",
                  data: projectWiseAnalysisObject.CreatedProjectWiseData,
                  fill: false,
                  borderColor: "red",
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                y : {
                  stacked: true,
                },
              },
            },
          });
        }
      );
    };
    $scope.monthValue='03';
    $scope.monthChangeFunctionForProject = function (monthValue) {
      $scope.statusFunctionOfProject(
        $scope.projectName,
        $scope.projectId,
        monthValue
      );
      $scope.monthValue = monthValue;  
    };

    var monthWiseChar;
    $scope.monthWiseAnalysis = function (currentMonthValue) {
      adminServices.monthWiseAnalysis(
        currentMonthValue,
        function (projectCreatedDayWise) {
          
          if (monthWiseChar) {
            monthWiseChar.destroy();
          }
          $timeout(function () {
            monthWiseChar = new Chart("line", {
              type: "line",
              data: {
                labels: projectCreatedDayWise.dates,
                datasets: [
                  {
                    label: "Number of projects Created this month",
                    data: projectCreatedDayWise.data,
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
          });
        }
      );
    };
    $scope.monthChangeFunction = function (monthValue) {
      $scope.monthWiseAnalysis(monthValue);
    };
    $scope.monthWiseAnalysis("03");

    adminServices.statistics(
      token,
      function (perUserProject,top3Employees,fastestPaceProject,
        projectStatusNumber,
        isUpcomingProjects,
        overDueProjects
      ) {
        $scope.statistics = {projectStatusNumber ,top3Employees ,isUpcomingProjects ,overDueProjects  }

        $timeout(function () {
          new Chart("barchart", {
            type: "bar",
            data: {
              labels: fastestPaceProject.projectName,
              datasets: [
                {
                  label: "Fastest Pace Project",
                  data: fastestPaceProject.projectPace,
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
        }, 0);

        $timeout(function () {
          new Chart("pie-chart", {
            type: "pie",
            data: {
              labels: perUserProject.workloadedEmployees,
              datasets: [
                {
                  label: "Population (millions)",
                  backgroundColor: ["#5bf556", "#ffc107", "#dc3545", "#6610f2"],
                  data: perUserProject.workloadedEmployeesCount,
                },
              ],
            },
            options: {
              title: {
                display: true,
                text: "Top 4 workloaded Employees",
              },
            },
          });
        }, 0);
      }
    );
  }
);
