myApp.controller(
    "employeeStatsController",function($scope ,  employeeServices){


        var token = sessionStorage.getItem("token");
        var dayWiseChart; 

        $scope.viewProjectProgress= function(projectId){
            employeeServices.viewTicket( 
                projectId, token ,
               function (response) {
                
                $scope.ticketProgress = response ; 
               }
             ); 
        }
 
        

        $scope.monthWiseAnalysis = function(currentMonthValue){
            
        employeeServices.employeeStatistics(currentMonthValue , token , function(taskcompletedDayWise){
        
            var monthNumber  = [31,28,31,30,31,30,31,31,30,31,30,31 ]
        var dates = [];
      var createdData = [];
      for (var i = 0; i <= monthNumber[currentMonthValue-1] ; i++) {
        createdData.push(0);
        dates.push(i);
      }
      taskcompletedDayWise.forEach(function (element) {
        createdData.splice(element._id, 1, element.count);
      });
      if(dayWiseChart){
        dayWiseChart.destroy(); 
      }
            
               dayWiseChart =  new Chart("line", {
                  type: "line",
                  data: {
                    labels: dates,
                    datasets: [
                      {
                        label: "Number of task completed this month",
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
        })
    }
    $scope.monthWiseAnalysis('03') ; 
        $scope.monthChangeFunction= function(monthValue){
            $scope.monthWiseAnalysis(monthValue) ; 
          }

          
        employeeServices.employeeStats(token , function(countTheProjects ,  upcomingProjects , overdueProjects){
             $scope.upcomingProjects=  upcomingProjects  ; 
             $scope.overdueProjects = overdueProjects ; 
             $scope.countTheProjects = countTheProjects ; 
        })

        employeeServices.progressProject(token , function(response){
          
              var projectName = response.map((element) => {
                return element.projectName;
              });
              var projectProgress = response.map((element) => {
                return element.progress;
              });
      
             
                new Chart("barchart", {
                  type: "bar",
                  data: {
                    labels: projectName,
                    datasets: [
                      {
                        label: "Highest Progress project this month",
                        data: projectProgress,
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
    });  