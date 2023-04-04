var fac = function ($http) {
  return {
    SiginAsOrganization: function (data, cb) {
      console.log(data);
      $http
        .post("http://localhost:8080/signin/singinAsOrganization", data)
        .then(
          function (res) {
            console.log(res);
            cb(res);
          },
          function (err) {
            cb(err);
            return err;
          }
        );
    },
    SiginAsUsers: function (data, cb) {
      console.log(data);
      $http.post("http://localhost:8080/signinAsUser", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          cb(err);
          return err;
        }
      );
    },
  };
};

myApp.service("signinServices", fac);
