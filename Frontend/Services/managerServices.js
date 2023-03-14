var fac = function ($http) {
  return {
    readingdata: function (token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get("http://localhost:8080/manager/fetchingProjects", config)
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
  };
};

myApp.factory("managerServices", fac);
