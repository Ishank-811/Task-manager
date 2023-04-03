const mongoose = require("mongoose"); 
const commentSchema =  mongoose.Schema({
    organization :{
        organizationId : {type:mongoose.Schema.Types.ObjectId ,   required:true}, 
        name:{type:String , required:true , trim:true}
    },
    ticket:{
    ticketId:{type:mongoose.Schema.Types.ObjectId , required:true} 
    }, 
    comments :{
        comment:{type:String},
        file:{type:String} , 
        commentBy:{
            role:{type:String},
            name:{type:String},
            username:{type:String}
        }
    },
    createdAt:{
        type:Date, 
        default:new Date(),
    }
})
const Comment= mongoose.model("Comment", commentSchema);
module.exports = Comment ; 