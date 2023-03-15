var fac = function ($http) {
  return {
    sendingdata: function (data, cb) {
      $http({
        method: "POST",
        url: "http://localhost:8080/organization/registeringUsers",
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
          cb(err);
        });
    },
    ReadingData: function (token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };

      $http.get("http://localhost:8080/organization/fetchingUser", config).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          if (!err.data.validity) {
            cb(err);
          }
          // return err
        }
      );
    },
    updateUser: function (data, cb) {
      console.log(data);
      $http
        .patch(
          `http://localhost:8080/organization/updatingUser/${data._id}`,
          data
        )
        .then(function (res) {
          cb(res);
        }),
        function (err) {
          console.log(err);
        };
    },
    searchUser : function(data , cb){
      console.log(data); 
      $http
        .get(
          `http://localhost:8080/organization/searchUser?adminId=${data.adminId}&value=${data.val} `
        )
        .then(function (res) {
          cb(res);
        }),
        function (err) {
          console.log(err);
        };
    }
  };
};

myApp.factory("organizationServices", fac);
