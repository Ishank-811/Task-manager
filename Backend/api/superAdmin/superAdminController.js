const organization = require("../../model/oganizationModel"); 
var users = require("../../model/usersModel"); 
const fetchAllOrganization = function(req,res){
    organization.find({}).then(function(response){
        res.status(202).send(response);
 
    }).catch(function(error){
        console.log(error); 
    })

}
const AllowOrganization = function(req,res){
  console.log(req.body); 
 
      console.log(req.params); 
      organization.findByIdAndUpdate(req.body._id, {valid:true}, {new:true}).then(function(response){
          res.status(202).send(response);  
          var newUser = new users({
            organization:{
              name:req.body.organizationName,  
              organizationId:req.body._id,
            },
            firstName:req.body.adminUsername+'first',
            lastName:req.body.adminUsername+'last',
            username:req.body.adminUsername,
            password:req.body.adminPassword,
            role:"Admin", 
            isDeleted:false,
          }) 
          newUser.save().then(function(){}); 
      }).catch(function(error){
          console.log(error); 
      })
} 

const addOrganization = function(req,res){
console.log(req.body); 
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
      valid:true
    });
    response.save().then(function(){
        var newUser = new users({
            organization:{
              name:req.body.organizationName,  
              organizationId:req.body._id,
            },
            firstName:req.body.email+'first',
            lastName:req.body.email+'last',
            username:req.body.email,
            password:req.body.password,
            role:"Admin", 
            isDeleted:false,
          }) 
          newUser.save().then(function(){}); 
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
}

const updateOrganization = function(req,res){
    // organization.findByIdAndUpdate(req.params.organizationId ,{organizationName:req.body.organizationName
    //      ,adminUsername:req.body.adminUsername } , {new:true}).then(function(response){
    //         res.status(202).send(response); 
    //      }).catch(function(error){
    //         res.status(400).send("Organization Username already exist");
    //         // console.log(error); 
    //      })
}

var statistics = function(req,res){
  
  
}

module.exports = {fetchAllOrganization , AllowOrganization , addOrganization , updateOrganization ,statistics } ;