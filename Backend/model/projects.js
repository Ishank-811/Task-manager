const mongoose = require("mongoose"); 
const ProjectSchema =  mongoose.Schema({
    projectName:{
        type : String, 
        required:true , 
        trim:true
    },
    organization :{
        organizationId : {type:mongoose.Schema.Types.ObjectId ,  ref:"Organization", required:true}, 
        name:{type:String , required:true , trim:true}
    },
    projectManger : {
        projectMangerId : {  type:mongoose.Schema.Types.ObjectId,  ref:"Users",  required:true},
        name:{type:String , required:true , trim:true},
        username:{type:String, required:true , trim:true}
    },
    assignedTo :[
       {
        assignedUserId:{type:mongoose.Schema.Types.ObjectId , require:true}, 
        name:{type:String , required:true , trim:true},
        username:{type:String,  required:true , trim:true},
        isStarted : {type:Boolean , required:true , default:false},
       },
    ],
    priority:{
        type:String , 
        enum:['High' , 'Low' , 'Medium'],
        required:true 
    },  
    createdAt:{
        type:Date,
        required:true,  
    },
    startDate :{
        type:Date, 
        required:true, 
    },
    endDate:{
        type:Date,
        required:true , 
    }

})
const Project= mongoose.model("Project", ProjectSchema);
module.exports = Project ; 