const mongoose = require("mongoose"); 
const ProjectDetailSchema =  mongoose.Schema({
    projectName:{
        type : String, 
        required:true , 
        trim:true,
        
    },
    projectDescription:{
        type:String, 
        required:true,
        trime:true, 
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
        default: "started",
    },
    isCompleted:{
        status:{type:Boolean ,required:true , default:false}, 
        updatedAt:{type:Date ,required:true,  default:new Date()}
    },
    isDeleted:{
        type:Boolean,
        default:false,
        required:true
    }
})

const ProjectDetails= mongoose.model("ProjectDetails", ProjectDetailSchema);
module.exports = ProjectDetails ; 