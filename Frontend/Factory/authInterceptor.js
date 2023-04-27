myApp.factory('authInterceptor', function($q, $location, authToken) {
    return {
      request: function(config) {
        var token = sessionStorage.getItem("token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          authToken.removeToken();
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  });