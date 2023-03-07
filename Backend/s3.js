require('dotenv').config(); 
const fs= require('fs'); 
const S3 = require('aws-sdk/clients/s3');
const path = require("path");  

var bucketName = process.env.AWS_BUCKET_NAME
var region =process.env.AWS_BUCKET_REGION
var accessKeyId =process.env.AWS_ACCESS_KEY
var secretAccessKey =process.env.AWS_SECRET_ACCESS_KEY
// console.log(process.env.AWS_BUCKET_NAME); 
// console.log("hello");
console.log(); 
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(file){
       
    const fileStream = fs.createReadStream(file.path);  
   
    fileStream.on("error", err => console.log(err));
    
    const uploadParams = {
        Bucket: bucketName,  
        Body: fileStream,   
        Key:file.filename
    }
    // return "hello"; 
   return s3.upload(uploadParams).promise(); 
}


exports.uploadFile = uploadFile


