const mongoose = require("mongoose"); 
const userSchema =  mongoose.Schema({
    organization:{
        name:{type:String,  required:true, trim:true},
        organizationId:{type:mongoose.Schema.Types.ObjectId , require:true , ref :"Organization"  }
    },
    firstName:{
        type:String, 
        required : true, 
        trime : true 
    },
    lastName:{
        type:String ,
        required : true, 
        trim : true , 
    },
    username:{
        type : String, required:  true , trim:true
    },
    password :{
        type:String, required:  true, trim:true
    },
    role: {
        type:String,
         required:true,  
         default : "Employee",
         enum : ["Employee", "Manager" ,"Admin" ]
    },
    })
const users= mongoose.model("Users", userSchema);
module.exports = users ; 