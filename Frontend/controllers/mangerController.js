myApp.controller("mangerController", function ($scope, $window,$timeout,  managerServices , employeeServices) {

    var role = sessionStorage.getItem("role");
    var token = sessionStorage.getItem("token");
    $scope.message = "Manager Dashboard";

    if (role == "Manager") {
      $scope.hideticket = true;
      $scope.ViewTicketLoader=true ;
      
      

  



       $window.location.href = "#!/MangerDashboard";
       managerServices.readingdata(token, function (data) {
       $scope.response = data.data.projectDetails;});
      
      
        $scope.getTickets=  function(val){
          // console.log(val._id); 
          var data  ={
            projectId : val._id , 
            token 
          }
          $scope.ticket="";
          $scope.noTickets = false; 
          $scope.ViewTicketLoader=false ; 
          managerServices.viewTicket(data, function(response){
            console.log(response.data.ticketDetails); 
            if(response.data.ticketDetails.length==0){
            $scope.ViewTicketLoader=true ; 
             $scope.noTickets = true;  
             $scope.hideticket = true;
            }else{
            $scope.ViewTicketLoader=true ; 
            $scope.noTickets = false;  
            $scope.hideticket = false; 
            $scope.ticket = response.data.ticketDetails;
            // console.log($scope.ticket);
            var inactiveNumber = 0 ;
            var completedNumber = 0 ; 
            var progressNumber =0; 
            var startedNumber=0 ;  
            $scope.ticket.forEach(element => {
              // console.log(element.status) ;
              if(element.status=="Inactive"){
                inactiveNumber++; 
                console.log( inactiveNumber )
              }else if(element.status=="completed"){
                completedNumber++; 
              }else if(element.status=="inProgress"){
                progressNumber++; 
              }else if(element.status=="started"){
                startedNumber++; 
              }

            }); 
            $timeout(function() {
              new Chart(("pie-chart"), {
                type: 'pie',
                data: { 
                  labels: ["Progress", "Completed", "Not Started" , "Started"],
                  datasets: [{
                    label: "Population (millions)",
                    backgroundColor: ["#5bf556", "#ffc107","#dc3545","#6610f2"],
                    data: [progressNumber,completedNumber,inactiveNumber, startedNumber]
                  }]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                  }
                }
            })},0); 

            }
          })
        }
        $scope.showComments = true ; 
        $scope.ticketIdForComment ; 
        $scope.comments=[]; 
        $scope.viewComments=  function(val){
          // console.log(val);
          console.log(val._id); 
          
          $scope.ticketIdForComment= val._id; 
          managerServices.viewComments({ticketId:val._id} , function(data){
            if(data.data.length<=0){
              $scope.showNoComments = "No Comments"; 
              $scope.comments=""; 
            }else{
              $scope.showNoComments=""
            $scope.comments= data.data;
            $scope.showComments = false;
            $scope.ticketId = data.data._id ; 
            }
          })
           
        }

        $scope.addCommentsFormSubmit = function($event){
          console.log($scope.ticketIds); 
          console.log($scope.addComments); 
          var data = {
            comments : $scope.addComments , 
            ticketId :  $scope.ticketIdForComment, 
            token
         }
         employeeServices.addComment(data , function(response){
          console.log(response); 
          $scope.comments.push(response.data); 
          alert("Comment submitted");
          $scope.addComments = ""; 

           
         })
       
        }







    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
  
);
