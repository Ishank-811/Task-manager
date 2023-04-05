myApp.controller(
  "managerStatsController",
  function ($scope, $timeout, managerServices) {
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

    

    var chart1 ; 
    $scope.statusFunctionOfEmployee = function(userName , userId){
      managerServices.userStats(userId, function(userStats){
          if(chart1){
            chart1.destroy(); 
          }
          chart1 =  new Chart("PerEmployeeStatus", {
            type: "bar",
            data: {
              labels: userStats.projectNameLabel,
              datasets: [
                {
                  label: "Total task assigned in each task",
                  data: userStats.numberOfTaskData,
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
      })
    }

    var debounceTimer;
    $scope.nameOfEmployeeChangeFunction = function(nameOfEmployee){
      if (debounceTimer) {
        $timeout.cancel(debounceTimer);
      }
      debounceTimer = $timeout(function () {
        managerServices.searchEmployee(nameOfEmployee, function(response){
          $scope.employeeList = response.data;
        })
      }, 800);
    }
    

    var chart;
    $scope.overViewOfProject = function (projectId) {
      managerServices.projectTaskStats(projectId, function (projectTaskStats) {      
        if (chart) { 
          chart.destroy();
        }
        chart = new Chart("barchart", {
          type: "bar",
          data: {
            labels: projectTaskStats.users,
            datasets: [
              {
                label: "Completed tasks",
                data: projectTaskStats.completedTask,
                backgroundColor: "rgba(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Working tasks",
                data: projectTaskStats.workingTasks,
                backgroundColor: "rgba(255, 206, 86)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
              },
              {
                label: "Inactive tasks",
                data: projectTaskStats.inactiveTasks,
                backgroundColor: "rgba(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Total tasks",
                data: projectTaskStats.totalTasks,
                backgroundColor: "rgba(54, 162, 235)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ stacked: true }],
            },
          },
        });
      });
    };

    managerServices.statistics(token , function (
      countBystatus,
      isUpcomingProject,
      overDueProject,
      completionRateOfProject,
      taskCreatedDayWise,
      
    ) { 
      $scope.statistics = {countBystatus ,isUpcomingProject, overDueProject }; 

      $timeout(function () {
        new Chart("line", {
          type: "line",
          data: {
            labels: taskCreatedDayWise.dates,
            datasets: [
              {
                label: "Number of task Created this month",
                data: taskCreatedDayWise.createdData,
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
      $timeout(function () {
        new Chart("completionRate", {
          type: "bar",
          data: {
            labels: completionRateOfProject.projectName,
            datasets: [
              {
                label: "Average time taked to complete a task",
                data: completionRateOfProject.avgCompletionTime,
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
    });
  }
);
 