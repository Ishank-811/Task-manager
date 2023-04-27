const organization = require("../../model/oganizationModel");

const registerAsorganization = function(req, res){
  console.log(req.body) ;
  organization
    .findOne({ adminUsername: req.body.email  })
    .then(function (userdetail) {
      if (userdetail) { 
        res.status(400).send("Organzation already exsist"); 
      } else {
        var response = new organization({
          adminUsername: req.body.email,
          adminPassword: req.body.password,
          organizationName: req.body.organizationName,
        });
        response.save().then(function(){
          res.status(202).send(response); 
        })
        .catch(function(error){
          console.log(error); 
        })
      }
    })
    .catch(function (e) {
      console.log(e);
    });
};

module.exports = { registerAsorganization };