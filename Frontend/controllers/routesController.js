var myApp = angular.module("mymodule", ["ui.router"]);
myApp.config(function ($stateProvider , $urlRouterProvider){
  // $urlRouterProvider.otherwise('signinAsOrganization'); 
  $urlRouterProvider.when('/AdminDashboard', '/AdminDashboard/projectList');
  $urlRouterProvider.when('/MangerDashboard', '/MangerDashboard/projectsList');
  $urlRouterProvider.when('/EmployeeDashboard', '/EmployeeDashboard/home');
  $urlRouterProvider.when("/organizationDashboard", 'organizationDashboard/employees');
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
    .state("organization.employee" ,  {
      url: "/employees",
      templateUrl: "views/organizationViews/organizationEmployees.html",
      controller: "organizationController",
    })
    .state("organization.statistics", {
      url: "/statistics",
      templateUrl: "views/organizationViews/organizationStats.html",
      controller: "organizationStatsController",
    })
    .state("signinAsUsers", {
      url: "/singinAsUsers",
      templateUrl: "views/signinAsUser.html",
      controller: "signinAsUsersController",
    })
    .state("MangerDashboard", {
      url: "/MangerDashboard",
      templateUrl: "views/manager/managerView.html",
      controller: "mangerController",
    })
    .state("MangerDashboard.viewProject", {
      url: "/projectsList",
      templateUrl: "views/manager/managerProjectsList.html",
      controller: "managerProjectListController",
    })
    .state("MangerDashboard.viewProjectDetails", {
      url: "/projectDetails/:projectId",
      templateUrl: "views/manager/managerProjectDetails.html",
      controller: "managerProjectDetailsController",
    })
    .state("EmployeeDashboard", {
      url: "/EmployeeDashboard",
      templateUrl: "views/employeeView/employeeView.html",
      controller: "employeeController",
    })
    .state("EmployeeDashboard.home", {
      url: "/home",
      templateUrl: "views/employeeView/employeeViewProject.html",
      controller: "employeeController",
    })
    .state("EmployeeDashboard.statistics" , {
      url: "/statistics",
      templateUrl: "views/employeeView/employeeStatistics.html",
      controller: "employeeStatsController",
    })
    .state("EmployeeDashboard.home.ticketDetails", {
      url: "/ticketDetails/:id",
      templateUrl: "views/employeeView/ticketDetails.html",
      controller: "ticketDetailsController",
    })
    .state("AdminDashboard", {
      url: "/AdminDashboard",
      templateUrl: "views/admin/adminView.html",
    })
    .state("AdminDashboard.projectList", {
      url: "/projectList",
      templateUrl: "views/admin/adminViewProject.html",
    })
    .state("AdminDashboard.statistics", {
      url: "/statistics",
      templateUrl: "views/admin/adminStats.html",
      controller:"adminStatsController"
    })
    .state("AdminDashboard.ViewProjectDetails", {
      url: "/ViewProjectDetails/:projectId",
      templateUrl: "views/admin/adminProjectDetails.html",
      controller: "adminProjectDetailsController",
    })
    .state("AdminDashboard.employees", {
      url: "/employees",
      templateUrl: "views/admin/employees.html",
      controller: "adminEmployeesController",
    })
    .state("MangerDashboard.viewTask", {
      url: "/viewTask",
      templateUrl: "views/manager/managerViewTask.html",
      controller: "managerViewTaskListController",
    })
    .state("MangerDashboard.statistics", {
      url: "/statistics",
      templateUrl: "views/manager/managerStats.html",
      controller: "managerStatsController",
    })
    .state("EmployeeDashboard.TaskList", {
      url:"/TaskList",
      templateUrl: "views/employeeView/employeeTaskList.html",
      controller: "employeeTaskListController",
    })
});

var mycontroller = function ($scope, $window) {
  var token = sessionStorage.getItem("token");
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
