const mongoose = require("mongoose"); 
const organizationSchema =  mongoose.Schema({
    organizationName:{
        type : String, required:  true , trim:true
    },
    adminUsername :{
        type:String, required:  true, trim:true,  unique:true
    },
    adminPassword : {
        type:String, required:true , trim:true
    },
    valid :{
        type:Boolean , default:false
    },
    joinedAt : {
        type:Date, default :new Date() , require:true
    }
   
})
const organization= mongoose.model("Organization", organizationSchema);
module.exports = organization ; 