myApp.controller(
  "superAdminController",
  function ($scope, $window, superAdminServices) {
    var role = sessionStorage.getItem("role");
    var token = sessionStorage.getItem("token");

    superAdminServices.statistics(function(response){
      console.log(response); 
    })

 
    if (role == "SuperAdmin") {
      $scope.organizationDetails = [];
      $scope.message = "superAdmin Dashboard";
      superAdminServices.fetchAllOrganization(token, function (response) {
        $scope.organizationDetails = response.data;
      });

      $scope.onfocusfun = function () {
        $scope.displaypasswordMessage = true;
      };

      $scope.onblurfun = function () {
        $scope.displaypasswordMessage = false;
      };

      $scope.passwordFeild = function (val) {
        var lowerCaseLetters = /[a-z]/g;
        if (val == undefined || !val.match(lowerCaseLetters)) {
          $scope.lowerCaseChecking = "invalid";
        } else {
          $scope.lowerCaseChecking = "valid";
        }

        var upperCaseLetters = /[A-Z]/g;
        if (val == undefined || !val.match(upperCaseLetters)) {
          $scope.uppercaseChecking = "invalid";
        } else {
          $scope.uppercaseChecking = "valid";
        }

        var numbers = /[0-9]/g;
        if (val == undefined || !val.match(numbers)) {
          $scope.numberChecking = "invalid";
        } else {
          $scope.numberChecking = "valid";
        }

        if (val == undefined || !(val.length >= 8)) {
          $scope.lengthChecking = "invalid";
        } else {
          $scope.lengthChecking = "valid";
        }
      };

      $scope.singupfun = function ($event) {
        $event.preventDefault();

        function checkPassword(str) {
          var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
          return re.test(str);
        }
        if (!checkPassword($scope.Password)) {
          $scope.passwordValidityFalse = true;

          return;
        }
        if ($scope.Password !== $scope.confirmPassword) {
          $scope.ConfirmPasswordMatchingFalse = true;
          return;
        }
      
        var newUser = {
          organizationName: $scope.organizationName,
          email: $scope.emailValid,
          password: $scope.Password,
        };

        superAdminServices.addOrganization(newUser, function (data) {
     
          if (data.status == 400) {
            $scope.showError = true;
          } else {
            $scope.organizationName = "";
            $scope.emailValid = "";
            $scope.Password = "";
            $scope.confirmPassword = "";
            alert("Successfully created");
          }
        });
      };

      $scope.createOrganization = function (val) {
        superAdminServices.AllowOrganization(val, function (response) {
       
          $scope.organizationDetails.forEach(function (element) {
            if (element._id == val) {
              element.valid = true;
            }
          });
          alert("organization Created");
        });
      };

      $scope.updateOrganizationName;
      $scope.updateOrganizationUsername;
      $scope.updateOrganizationId;
      $scope.updateOrganizationDetails = function (
        updateOrganizationName,
        updateOrganizationUsername,
        updateOrganizationId
      ) {
        $scope.updateOrganizationName = updateOrganizationName;
        $scope.updateOrganizationUsername = updateOrganizationUsername;
        $scope.updateOrganizationId = updateOrganizationId;
      };

      $scope.UpdateOrganizationFunction = function ($event) {
        $event.preventDefault();
       
        var data = {
          organizationId: $scope.updateOrganizationId,
          organizationName: $scope.updateOrganizationName,
          organizationUsername: $scope.updateOrganizationUsername,
        };
        superAdminServices.updateOrganization(data, function (response) {
         
          if (response.status == 400) {
            $scope.showErrorInUpdateForm = true;
          } else {
            $scope.showErrorInUpdateForm = false;
            $scope.organizationDetails.forEach(function (element) {
              if (element._id == response.data._id) {
                element.organizationName = response.data.organizationName;
                element.organizationUsername =
                  response.data.organizationUsername;
              }
            });
            alert("Organization Updated");
          }
        });
      };
    } else {
      $window.location.href = "#!/singinAsUsers";
    }
  }
);
