const Organization = require("../model/oganizationModel"); 
var LocalStrategy = require("passport-local").Strategy; 
module.exports = {

  initializer : function(passport){
  
passport.use(new LocalStrategy(

    function(username, password, done) {
        console.log(username);
        Organization.findOne({ organizationUsername: username }, function (err, organization) {
        if (err) {   return done(err); }
       
        if (!organization) { 
             return done(null, false); }
        if ((organization.organizationPassword!=password)) { 
            
            return done(null, false); }
       
        return done(null, organization);
      });
    }
  ))
  } 
 
}

