var fac = function ($http) {
  return {
    readingdata: function (data, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(`http://localhost:8080/manager/fetchingProjects?currentPage=${data.currentPage}`, config)
        .then(function (res) {
          console.log(res);
          cb(res);
        }),
        function (err) {
          return err;
        };
    },
    viewTicket: function (data, cb) {
      console.log(data);
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get(
          `http://localhost:8080/manager/viewTicket/${data.projectId}`,
          config
        )
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            return err;
          }
        );
    },
    viewComments: function (data, cb) {
      console.log(data);
      $http
        .get(`http://localhost:8080/manager/viewComments/${data.ticketId}`)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            return err;
          }
        );
    },
    addTasks : function(data , cb){

      $http({
        method: "POST",
        url: "http://localhost:8080/manager/addTasks",
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json",
        },
        data,
      })
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            return err;
          }
        );
    },
    viewAssignedTask : function(data,  cb){
      console.log(data);
      $http
      .get(
        `http://localhost:8080/manager/viewAssignedTask?projectId=${data.projectId}&employeeId=${data.userId}`
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    showAllTask : function(token , cb){

      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http
      .get(
        "http://localhost:8080/manager/showAllTask"  , config
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    } , 
    updateTask : function( taskId,data , cb){
      $http
      .patch(
        `http://localhost:8080/manager/updateTask/${taskId}`,
        data,
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    },
    dateWiseAnalysis : function(data , cb){
      $http
      .post(
        "http://localhost:8080/manager/dateWiseAnalysis"  ,data
      )
      .then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      ); 
    }

  };
};

myApp.factory("managerServices", fac);
