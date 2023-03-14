myApp.controller("signupController", function ($scope, singupServices) {
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
    console.log($scope.organizationName, $scope.emailValid, $scope.Password);
    const newUser = {
      organizationName: $scope.organizationName,
      email: $scope.emailValid,
      password: $scope.Password,
    };

    singupServices.sendingdata(newUser, function (data) {
      console.log(data);
      alert("Successfully signup")
    });
  };
});
