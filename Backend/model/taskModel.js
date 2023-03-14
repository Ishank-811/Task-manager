const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
  organization: {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
    name: { type: String, required: true, trim: true },
  },
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
  },
  task:{
    taskName : {type:String , required:true}  ,
    taskDescription: {type:String , required:true}, 
  },
  project: {
    ProjectName:{type:String, required: true},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectManager: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectManagerUsername  :{type:String,  required:true}, 
    projectManagerName : {type:String , required:true}, 
  },
  status: {
    type: String,
    required: true,
    default: "Inactive",
    trim: true,
  },
  createdAt:{
    type:Date , 
    required:true
  },
  startDate :{
    type:Date , 
    required:true
  },
  endDate:{
    type:Date , 
    required:true
  }
});
const tasks = mongoose.model("Tasks", taskSchema);
module.exports = tasks;
