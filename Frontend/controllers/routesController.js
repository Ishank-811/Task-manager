var myApp = angular.module("mymodule", ["ui.router"]);
myApp.config(function ($stateProvider) {
  $stateProvider
    .state("signinAsOrganization", {
      url: "/signinAsOrganization",
      templateUrl: "views/signinAsOrganization.html",
      controller: "signinAsOrganizationController",
    })
    .state("superAdmin", {
      url: "/superAdmin",
      templateUrl: "views/superAdmin.html",
      controller: "superAdminController",
    })
    .state("singup", {
      url: "/singup",
      templateUrl: "views/signup.html",
      controller: "signupController",
    })
    .state("organization", {
      url: "/organizationDashboard",
      templateUrl: "views/organizationViews/organizationPage.html",
      controller: "organizationController",
    })
    .state("signinAsUsers", {
      url: "/singinAsUsers",
      templateUrl: "views/signinAsUser.html",
      controller: "signinAsUsersController",
    })
    .state("MangerDashboard", {
      url: "/MangerDashboard",
      templateUrl: "views/managerView.html",
      controller: "mangerController",
    })
    .state("EmployeeDashboard", {
      url: "/EmployeeDashboard",
      templateUrl: "views/employeeView.html",
      controller: "employeeController",
    })
    .state("EmployeeDashboard.ticketDetails", {
      url: "/ticketDetails/:id",
      templateUrl: "views/ticketDetails.html",
      controller: "ticketDetailsController",
    })
    .state("AdminDashboard", {
      url: "/AdminDashboard",
      templateUrl: "views/adminView.html",
      controller: "adminController",
    })
    .state("AdminDashboard.updateProjectDetails", {
      url: "/updateProjectDetails/:id",
      templateUrl: "views/updateProjectDetails.html",
      controller: "updateProjectDetailsController",
    })
    .state("MangerDashboard.viewTask", {
      url: "/viewTask",
      templateUrl: "views/managerViewTask.html",
      controller: "mangerController",
    });
});


var mycontroller = function ($scope, $window) {
  var token = sessionStorage.getItem("token");
  console.log(token);
  if (token) {
    $scope.loggedin = true;
    $scope.loggedOut = false;
  } else {
    $scope.loggedin = false;
    $scope.loggedOut = true;
  }
  $scope.logout = function () {
    sessionStorage.clear();
    $scope.loggedOut = true;
    $scope.loggedin = false;
    $window.location.href = "#!/singinAsUsers";
  };
};

myApp.controller("mycontroller", mycontroller);
