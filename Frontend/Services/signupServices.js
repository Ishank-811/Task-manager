var fac = function($http){
    return {     
        sendingdata : function(data , cb){
             console.log(data); 
            $http.post("http://localhost:8080/registerAsorganization" , data).then(function(res){
                console.log(res);
                cb(res) ;  
            }, function(err){
                return err
                 ; 
            }); 
        }
    }
}

myApp.factory("singupServices" , fac) ; 

