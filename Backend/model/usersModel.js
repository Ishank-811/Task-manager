const mongoose = require("mongoose"); 
const userSchema =  mongoose.Schema({
    organization:{
        name:{type:String,  required:true, trim:true},
        organizationId:{type:mongoose.Schema.Types.ObjectId , require:true   }
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
        type:String, required:true
    },
    role: {
        type:String,
         required:true,  
         default : "Employee",
         enum : ["Employee", "Manager" ,"Admin","SuperAdmin" ]
    },
    isDeleted:{
        type:Boolean,
        default:false,
        required:true
    }
    })
const users= mongoose.model("Users", userSchema);
module.exports = users ; 