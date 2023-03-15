myApp.controller(
  "organizationController",
  function ($scope, $window, organizationServices) {
    var token = sessionStorage.getItem("token");

    console.log(token);
    if (token != null) {
      $scope.showNoEmployees = false; 
      organizationServices.ReadingData(token, function (data) {
        if (data.data.validity) {
          if (!data.data.roleAsOrganization) {
            $window.location.href = "#!/signinAsOrganization";
          } else {
            $scope.response = data.data.usersdata;
            console.log($scope.response); 
            if($scope.response.length==0){
              $scope.showNoEmployees = true;  
            }else{
              $scope.showNoEmployees = false;  
            }
          }
        } else {
          $window.location.href = "#!/signinAsOrganization";
        }
      });
    } else {
      location.href = "#!/signinAsOrganization";
    }

    $scope.addUsersDetails = function ($event) {
      $event.preventDefault();
      var data = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        username: $scope.email,
        password: $scope.password,
        role: $scope.role,
        token: token,
      };
      organizationServices.sendingdata(data, function (data) {
        if (data.status == 404) {
          console.log("hello");
          $scope.showError = true;
        }
      });
    };

    $scope.displayForm = false;
    $scope.updatedFirstName;
    $scope.updatedLastName;
    $scope.updatedUsername;
    $scope.UpdatedPassword;
    $scope.updatedRole;
    $scope.updateUser = function (
      _id,
      firstName,
      lastName,
      password,
      role,
      username
    ) {
      $scope.updatedFirstName = firstName;
      $scope.updatedUsername = username;
      $scope.updatedRole = role;
      $scope.updatedLastName = lastName;
      $scope.UpdatedPassword = password;
      $scope.updateFormDetails = function ($event) {
        $event.preventDefault();
        var data = {
          _id: _id,
          firstName: $scope.updatedFirstName,
          lastName: $scope.updatedLastName,
          username: $scope.updatedUsername,
          password: $scope.UpdatedPassword,
          role: $scope.updatedRole,
        };
        organizationServices.updateUser(data, function (response) {
          console.log(response);
        });
        // console.log()  ;
      };
    };
  }
);
