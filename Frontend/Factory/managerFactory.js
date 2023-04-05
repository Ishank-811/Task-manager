var fact=  function(){
return {
    addTaskFunctionValidation  :function(addTaskObject ,employeeDetails, cb){
        if (Date.now() <= addTaskObject.startDate && Date.now() <= addTaskObject.endDate) {
            if (addTaskObject.startDate <= addTaskObject.endDate) {
             addTaskObject['taskeEmployeesAssigned'] =employeeDetails ; 
                cb(true ,addTaskObject)  ; 
            }else{
                cb(false , addTaskObject); 
            }
        }else{
            cb(false , addTaskObject);
        }
    },

    formatDateForInputDate: function(date){
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            return (year + "-" + month + "-" + day) ; 
    },
    timeleft:function(endDate){
        var today = new Date();
        var endTimestamp = Date.parse(endDate);
        var diff = endTimestamp - today.getTime();
        return Math.round(diff / 86400000);
    },
    addTaskCallingFactory:function(documents , cb){
        var employeesAssignedToTask =  documents.map(function(element){
            return element.assignedTo ; 
          })
          var employeesAssignedToTaskStore =  documents.map(function(element){
            return element.assignedTo ; 
          })
          cb(employeesAssignedToTask , employeesAssignedToTaskStore); 
    },
    updateDeleteFrontEnd : function(viewTask ,taskId, cb){
        var indexToReplace = viewTask.findIndex(function(element){
            return element._id == taskId
        });
        if (indexToReplace !== -1) {
            viewTask.splice(indexToReplace, 1);
          }
          cb(viewTask);
    },
    updateTaskFrontEnd:function(viewTask , updateTaskObject ,response, cb){
        var indexToReplace = viewTask.findIndex(function(element){
            return element._id == updateTaskObject.taskId
        });
        if (indexToReplace !== -1) {
            viewTask.splice(indexToReplace, 1, response);
          }
          cb(viewTask)
    }   
}
}

myApp.factory("managerFactory" , fact) ; 