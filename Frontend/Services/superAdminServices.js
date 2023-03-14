var fac = function ($http) {
  return {
    fetchAllOrganization: function (token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http
        .get("http://localhost:8080/superAdmin/fetchAllOrganization", config)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            console.log(err);
          }
        );
    },
    AllowOrganization: function (data, cb) {
      $http
        .patch(`http://localhost:8080/superAdmin/AllowOrganization/${data}`)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            console.log(err);
          }
        );
    },
    addOrganization: function (data, cb) {
      $http
        .post("http://localhost:8080/superAdmin/addOrganization/", data)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            cb(err);
          }
        );
    },
    updateOrganization: function (data, cb) {
      $http
        .patch(
          `http://localhost:8080/superAdmin/updateOrganization/${data.organizationId}`,
          data
        )
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            cb(err);
            console.log(err);
          }
        );
    },
  };
};
myApp.factory("superAdminServices", fac);
