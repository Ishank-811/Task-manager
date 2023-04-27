const mongoose = require("mongoose");
require('dotenv').config(); 
var users= require("../model/usersModel"); 
const connection = function () {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      "mongodb+srv://ishankgoel811:Ishank123@cluster0.vpmzkx8.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(function (e) {
      users.findOne({username:process.env.SUPERADMIN_USERNAME}).then(function(response){
        if(response){
          console.log(process.env.SUPERADMIN_FIRSTNAME); 
          console.log("superAdmin exist")
        }else{
         var response = new users({
          organization: {
            name: process.env.SUPERADMIN_FIRSTNAME,
            organizationId: "qwertySecret",
          },
          firstName: process.env.SUPERADMIN_FIRSTNAME,
          lastName: process.env.SUPERADMIN_LASTNAME,
          username: process.env.SUPERADMIN_USERNAME,
          password: process.env.SUPERADMIN_PASSWORD,
          role: process.env.SUPERADMIN_ROLE,
          })
          response.save().then(function(){
            console.log("SuperAdmin Created"); 
          }).catch(function(error){
            console.log(error); 
            console.log("error in creating super Admin"); 
          })
          
        }
      })
      console.log("connected successfully");
    })
    .catch(function (e) {
      console.log(e);
    });
};

module.exports = connection;
