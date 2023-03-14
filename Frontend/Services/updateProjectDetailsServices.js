var fac = function ($http) {
  return {
    readingdata: function (id, cb) {
      //  console.log(data);

      $http.get(`http://localhost:8080/admin/getProjectDetails/${id}`).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },

    deleteuser: function (data, cb) {
      console.log(data);
      $http.post("http://localhost:8080/admin/deleteuser", data).then(
        function (res) {
          console.log(res);
          cb(res);
        },
        function (err) {
          return err;
        }
      );
    },
    addEmployees: function (data, cb) {
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
