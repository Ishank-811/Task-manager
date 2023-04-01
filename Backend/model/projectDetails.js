const mongoose = require("mongoose"); 
const ProjectDetailSchema =  mongoose.Schema({
    projectName:{
        type : String, 
        required:true , 
        trim:true,
        
    },
    organization :{
        organizationId : {type:mongoose.Schema.Types.ObjectId ,   required:true}, 
        name:{type:String , required:true , trim:true}
    },
    projectManger : {
        projectMangerId : {  type:mongoose.Schema.Types.ObjectId,   required:true},
        name:{type:String , required:true , trim:true},
        username:{type:String, required:true , trim:true}
    }, 
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
    }, 
    progress :{ 
        percentage:{type:Number, Default:0 , required:true} , 
        UpdatedAt : {type:Date , Default :new Date()},  
    },
    status:{
        type: String,
        required: true,
        enum:['started' , 'progress' , 'completed'],
        default: "started",
    },
    isCompleted:{
        status:{type:Boolean ,required:true , default:false}, 
        updatedAt:{type:Date ,required:true,  default:new Date()}
    }
})

const ProjectDetails= mongoose.model("ProjectDetails", ProjectDetailSchema);
module.exports = ProjectDetails ; 