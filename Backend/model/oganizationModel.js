const mongoose = require("mongoose"); 
const organizationSchema =  mongoose.Schema({
    organizationName:{
        type : String, required:  true , trim:true
    },
    organizationUsername :{
        type:String, required:  true, trim:true,  unique:true
    },
    organizationPassword : {
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