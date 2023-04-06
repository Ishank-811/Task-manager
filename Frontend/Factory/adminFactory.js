var fact = function(){

return {
    employeeFilter:function(userData , cb){
        var employeesAsigned = userData.filter(function (val) {
            return val.role == "Employee";
          });
          var response = userData.filter(function (val) {
            return val.role == "Manager";
          });
         var employeesAsignedStore= userData.filter(function (val) {
          return val.role == "Employee";
        });
        cb(employeesAsigned ,response ,employeesAsignedStore ); 
    },
    getDaysDiff:function(startDate, endDate){
      var startTimestamp = Date.parse(startDate);
      var endTimestamp = Date.parse(endDate);
      var diff = endTimestamp - startTimestamp;
      return Math.round(diff / 86400000);
    },
    projectValidation:function(createProjectObject ,selectedUser , cb ){
      if (Date.now() <= createProjectObject.startDate &&Date.now() <= createProjectObject.endDate) {
        if (createProjectObject.startDate <=createProjectObject.endDate) {
          createProjectObject["assignedTo"] =selectedUser;
          cb(true , createProjectObject); 
        }else{
          cb(false , createProjectObject); 
        }
    }else{
      cb(false , createProjectObject);
    }
    },
    updateFrontEnd:function(project , updateProjectObject ,updatedIndex , cb){
      project[updatedIndex].projectName =updateProjectObject.projectName;
      project[updatedIndex].priority = updateProjectObject.priority;
      if (updateProjectObject.startDate) {
        project[updatedIndex].startDate = updateProjectObject.startDate;
      }
      if (updateProjectObject.endDate) {
        project[updatedIndex].endDate = updateProjectObject.endDate;
      }
      cb(project); 
    }
}
}
myApp.factory("adminFactory" , fact) ; 