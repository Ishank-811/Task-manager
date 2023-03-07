const mongoose = require("mongoose");
const ticketSchema = mongoose.Schema({
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
  priority:{
    type:String , 
    enum:['High' , 'Low' , 'Medium'],
    required:true 
}, 
});
const tickets = mongoose.model("Tickets", ticketSchema);
module.exports = tickets;
