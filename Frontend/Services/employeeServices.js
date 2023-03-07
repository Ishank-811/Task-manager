var fac = function ($http) {
  return {
    readingdata: function (data, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + data,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get("http://localhost:8080/employee/fetchingProjects", config).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    addTicket: function (data, cb) {
      $http({
        method: "POST",
        url: "http://localhost:8080/employee/addTicket",
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json",
        },
        data,
      })
        .then(function (res) {
          console.log(res);
          cb(res);
        })
        .catch(function (err) {
          // console.log(err);
        });
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
          `http://localhost:8080/employee/viewTicket/${data.projectId}`,
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
    addComment: function (data, cb) {
      console.log(data);
      var config = {
        headers: {
          Authorization: "Bearer " + data.token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .patch(
          `http://localhost:8080/employee/addComment/${data.ticketId}`,
          data,
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
    updatingStatus: function (data, cb) {
      console.log(data);
      $http
        .patch(
          `http://localhost:8080/employee/updatingStatus/${data.ticketId}`,
          data
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
    uploadFileToUrl: function (data, cb) {
      $http({
        method: "PATCH",
        url: `http://localhost:8080/employee/uploadFileToUrl/${data.ticketId}`,
        headers: {
          Authorization: "Bearer " + data.token,
          "Content-Type": undefined,
        },
        data: data.formData,
      })
        .then(function (res) {
          console.log(res);
          cb(res);
        })
        .catch(function (err) {
          // console.log(err);
        });
    },
  };
};

myApp.factory("employeeServices", fac);
