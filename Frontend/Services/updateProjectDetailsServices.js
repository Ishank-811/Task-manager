var fac = function ($http) {
  return {
    addEmployees: function (projectDetails , userDetails, cb) {
      var data=  {
      project:{projectName:projectDetails.projectName ,  projectId:projectDetails._id},
      organization:projectDetails.organization,
      projectManger:projectDetails.projectManger,
      assignedTo : {
        assignedUserId:userDetails._id ,
        name:userDetails.firstName,
        username:userDetails.username,
        isisStarted:false
      }, priority: projectDetails.priority,
      createdAt:new Date(),
      startDate: projectDetails.startDate,
      endDate: projectDetails.endDate,
      }
      $http.post("http://localhost:8080/admin/addEmployees", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
  };
};

myApp.factory("updateProjectDetailsServices", fac);
