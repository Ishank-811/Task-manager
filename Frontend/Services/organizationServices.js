var fac = function ($http) {
  return {
    sendingdata: function (data,token ,cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      $http.post("http://localhost:8080/organization/registeringUsers" , data, config).then(function(response){
        cb(response);  
      }).catch(function(error){
        cb(error);  
        console.log(error); 
      })
      
    },
    ReadingData: function (currentPage,filterEmployee, token, cb) {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json;odata=verbose",
        },
      };
      console.log(filterEmployee); 

      $http.get(`http://localhost:8080/organization/fetchingUser?currentPage=${currentPage}&filterEmployee=${filterEmployee}`, config).then(
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
    searchUser : function(adminId , employeeValue , cb){
      
      $http
        .get(
          `http://localhost:8080/organization/searchUser?adminId=${adminId}&value=${employeeValue} `
        )
        .then(function (res) {
          cb(res);
        }),
        function (err) {
          console.log(err);
        };
    },
    stats:function(cb){
      
      $http
      .get(
        "http://localhost:8080/organization/stats"
      )
      .then(function (res) {
        cb(res.data.numOfRole , res.data.top2Manager , res.data.top3Employee);
      }),
      function (err) {
        console.log(err);
      };
    },
    deleteUser:function(employeeId , role ,cb){
      $http
      .patch(
        `http://localhost:8080/organization/deleteUser?employeeId=${employeeId}&role=${role}`,
      )
      .then(function (res) {
        cb(res);
      }),
      function (err) {
        console.log(err);
      };
    },
    activateUser:function(employeeId , cb){
      $http
      .patch(
        `http://localhost:8080/organization/activateUser?employeeId=${employeeId}`,
      )
      .then(function (res) {
        cb(res);
      }),
      function (err) {
        console.log(err);
      };
    },
  };
};

myApp.service("organizationServices", fac);
