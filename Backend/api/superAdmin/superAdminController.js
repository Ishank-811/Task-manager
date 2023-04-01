const organization = require("../../model/oganizationModel"); 
const fetchAllOrganization = function(req,res){
    organization.find({}).then(function(response){
        res.status(202).send(response);
 
    }).catch(function(error){
        console.log(error); 
    })

}
const AllowOrganization = function(req,res){
    console.log(req.params); 
    organization.findByIdAndUpdate(req.params.organizationId , {valid:true}, {new:true}).then(function(response){
        // console.log(response);
        res.status(202).send(response);  
    }).catch(function(error){
        console.log(error); 
    })
}

const addOrganization = function(req,res){
// console.log(req.body); 
organization
    .findOne({ organizationUsername: req.body.email })
    .then(function (userdetail) {
      if (userdetail) {
        res.status(400).send("Organzation already exsist"); 
        
      } else {
        var response = new organization({
          organizationUsername: req.body.email,
          organizationPassword: req.body.password,
          organizationName: req.body.organizationName,
          valid:true
        });
        response
          .save()
          .then(function () {
            res.send(response);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    })
    .catch(function (e) {
      console.log(e);
    });
}

const updateOrganization = function(req,res){
    organization.findByIdAndUpdate(req.params.organizationId ,{organizationName:req.body.organizationName
         ,organizationUsername:req.body.organizationUsername } , {new:true}).then(function(response){
            res.status(202).send(response); 
         }).catch(function(error){
            res.status(400).send("Organization Username already exist");
            // console.log(error); 
         })
}

var statistics = function(req,res){
  
  
}

module.exports = {fetchAllOrganization , AllowOrganization , addOrganization , updateOrganization ,statistics } ;