const mongoose = require("mongoose"); 
const organizationSchema =  mongoose.Schema({
    organizationName:{
        type : String, required:  true , trim:true
    },
    organizationUsername :{
        type:String, required:  true, trim:true
    },
    organizationPassword : {
        type:String, required:true, unique:true , trim:true
    }
   
})
const organization= mongoose.model("Organization", organizationSchema);
module.exports = organization ; 