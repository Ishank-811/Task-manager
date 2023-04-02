
myApp.controller(
    "organizationStatsController",
    function ($scope ,organizationServices) {
       
        organizationServices.stats(function(numOfRole , top2Manager , top3Employee){
            $scope.numOfRole = numOfRole ;  
            $scope.top3Employee = top3Employee ;
            $scope.top2Manager = top2Manager ; 
            console.log(top3Employee);  
            console.log(numOfRole , top2Manager , top3Employee); 
        })
    }) ; 