myApp.controller(
  "managerStatsController",
  function ($scope, $timeout, managerServices) {
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
      managerServices.userStats(userId, function(response){
       
        var projectNameLabel = response.data.map(function(element){
          return element.projectName ; 
        }) 
        var numberOfTaskData= response.data.map(function(element){
          return element.taskCount  ; 
        })
          if(chart1){
            chart1.destroy(); 
          }
       
          chart1 =  new Chart("PerEmployeeStatus", {
            type: "bar",
            data: {
              labels: projectNameLabel,
              datasets: [
                {
                  label: "Total task assigned in each task",
                  data: numberOfTaskData,
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
     
      managerServices.projectTaskStats(projectId, function (response) {
       
        var users = response.data.map(function (element) {
          return element.name;
        });
        var completedTask = response.data.map(function (element) {
          return element.tasksCompleted;
        });
        var workingTasks = response.data.map(function (element) {
          return element.workingTasks;
        });
        var inactiveTasks = response.data.map(function (element) {
          return element.inactiveTasks;
        });
        var totalTasks = response.data.map(function (element) {
          return element.totalTasksAssigned;
        });

        var ctx = document.getElementById("barchart").getContext("2d");

        if (chart) {
        
          chart.destroy();
        }
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: users,
            datasets: [
              {
                label: "Completed tasks",
                data: completedTask,
                backgroundColor: "rgba(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Working tasks",
                data: workingTasks,
                backgroundColor: "rgba(255, 206, 86)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
              },
              {
                label: "Inactive tasks",
                data: inactiveTasks,
                backgroundColor: "rgba(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Total tasks",
                data: totalTasks,
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

    managerServices.statistics(function (
      countBystatus,
      isUpcomingProject,
      overDueProject,
      completionRateOfProject,
      taskCreatedDayWise,
      
    ) {

     
      var dates = [];
      var createdData = [];
      for (var i = 0; i < 31; i++) {
        createdData.push(0);
        dates.push(i);
      }
      taskCreatedDayWise.forEach(function (element) {
        createdData.splice(element.day, 1, element.count);
      });

      $timeout(function () {
        new Chart("line", {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Number of task Created this month",
                data: createdData,
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

      $scope.countBystatus = countBystatus;
      $scope.isUpcomingProject = isUpcomingProject;
      $scope.overDueProject = overDueProject;
      var projectName = completionRateOfProject.map(function (element) {
        return element.projectName;
      });
      var avgCompletionTime = completionRateOfProject.map(function (element) {
        return element.avgCompletionTime / (1000 * 60 * 60);
      });
      $timeout(function () {
        new Chart("completionRate", {
          type: "bar",
          data: {
            labels: projectName,
            datasets: [
              {
                label: "Average time taked to complete a task",
                data: avgCompletionTime,
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
