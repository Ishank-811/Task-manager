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

    $scope.statusFunctionOfProject = function (
      projectName,
      projectId,
      monthValue
    ) {
      $scope.projectName = projectName;
      $scope.projectId = projectId;
      $scope.monthValue=monthValue ; 
      monthNum = parseInt(monthValue);
      adminServices.projectWiseAnalysis(
        projectId,monthValue,
        function (numberOfTaskCompleted, numberOfTaskCreated) {
        
          var ProjectWisedates = [];
          var ProjectWiseData = [];
          var monthNumber = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          for (var i = 0; i <= monthNumber[monthNum - 1]; i++) {
            ProjectWiseData.push(0);
            ProjectWisedates.push(i);
          }

          var CreatedProjectWiseData = [];
          for (var i = 0; i <= 31; i++) {
            CreatedProjectWiseData.push(0);
          }
          numberOfTaskCompleted.forEach(function (element) {
            ProjectWiseData.splice(
              element.day,
              1,
              element.numberOfTaskCompleted
            );
          });
          numberOfTaskCreated.forEach(function (element) {
            CreatedProjectWiseData.splice(
              element.day,
              1,
              element.numberOfTaskCreated
            );
          });
          if (projectWiseChart) {
            projectWiseChart.destroy();
          }
          projectWiseChart = new Chart("projectWiseAnalysis", {
            type: "line",
            data: {
              labels: ProjectWisedates,
              datasets: [
                {
                  label: "Number of projects completed this month",
                  data: ProjectWiseData,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
                {
                  label: "Number of projects created this month",
                  data: CreatedProjectWiseData,
                  fill: false,
                  borderColor: "red",
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
          var dates = [];
          var data = [];
       
          var monthNumber = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

          for (var i = 0; i <= monthNumber[currentMonthValue - 1]; i++) {
            data.push(0);
            dates.push(i);
          }

          projectCreatedDayWise.forEach(function (element) {
            data.splice(element.day, 1, element.count);
          });
          if (monthWiseChar) {
            monthWiseChar.destroy();
          }
          $timeout(function () {
            monthWiseChar = new Chart("line", {
              type: "line",
              data: {
                labels: dates,
                datasets: [
                  {
                    label: "Number of projects Created this month",
                    data: data,
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
      function (
        perUserProject,

        top3Employees,
        fastestPaceProject,
        projectStatusNumber,
        isUpcomingProjects,
        overDueProjects
      ) {
        $scope.projectStatusNumber = projectStatusNumber;
        $scope.top3Employees = top3Employees;
        $scope.isUpcomingProjects = isUpcomingProjects;
        $scope.overDueProjects = overDueProjects;
        var workloadedEmployees = perUserProject.map((element) => {
          return element.name;
        });
        var workloadedEmployeesCount = perUserProject.map((element) => {
          return element.count;
        });
        var projectName = fastestPaceProject.map((element) => {
          return element.projectName;
        });
        var projectPace = fastestPaceProject.map((element) => {
          return element.pace.pace;
        });

        $timeout(function () {
          new Chart("barchart", {
            type: "bar",
            data: {
              labels: projectName,
              datasets: [
                {
                  label: "Fastest Pace Project",
                  data: projectPace,
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
              labels: workloadedEmployees,
              datasets: [
                {
                  label: "Population (millions)",
                  backgroundColor: ["#5bf556", "#ffc107", "#dc3545", "#6610f2"],
                  data: workloadedEmployeesCount,
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
