var fac = function($http){
    return {     
        readingData : function(token , cb){
            var config = {headers:  {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json;odata=verbose' ,
               
            }}; 
            $http.get("http://localhost:8080/admin/fetchingUsers" , config).then(function(res){
                console.log(res);
                cb(res) ;  
            }, function(err){
                cb(err); 
                return err ; 
            }); 
        }, 
        creatingPorject : function(data , cb){
           console.log(data); 
            $http.post("http://localhost:8080/admin/creatingProject" , data).then(function(res){
                console.log(res);
                cb(res) ;  
            }, function(err){
                cb(err); 
                return err ; 
            }); 
        },
        fetchProjects: function(data, cb){
            
            var config = {headers:  {
                'Authorization': 'Bearer '+data,
                'Accept': 'application/json;odata=verbose' ,
            }};     
            $http.get("http://localhost:8080/admin/fetchProjects", config).then(function(res){
                console.log(res);
                cb(res) ;  
            }, function(err){
                // cb(err); 
                return err ; 
            }); 
        },
        viewProfile: function(data, cb){
            $http.get(`http://localhost:8080/admin/viewProfile?userId=${data}`).then(function(res){
                console.log(res);
                cb(res) ;  
            }, function(err){
                cb(err); 
                return err ; 
            });    
        }
 
    }
}

myApp.factory("adminServices" , fac) ; 
