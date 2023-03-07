const express= require("express") ;
const app = express() ;  
const cors  =require("cors") ;
const conn = require("./config/db"); 
const passport = require("passport");
const port = 8080 ;

conn() ; 
app.use(passport.initialize());

app.use(express.json({limit:"30mb"  , extended:true}) ) ; 
app.use(express.urlencoded({limit:"30mb"  , extended:true}) ) ; 
app.use(cors()) ; 
const multer = require("multer"); 

app.get("/", (req,res)=>{
    res.send("app is running"); 
})
app.use("/" , require("./api/singup/singupRoutes"));
app.use("/signin",  require("./api/singin/singinRoute")); 
app.use("/signinAsUser",  require("./api/singin/singinAsUsersRoute")); 
app.use("/organization", require("./api/OrganizationAPI/organizationRoutes")); 
app.use("/admin", require("./api/admin/adminroutes")); 
app.use("/manager" , require("./api/manager/managerRoute")); 
app.use("/employee",  require("./api/employee/employeeRoutes"));






app.listen(port , ()=>{
    console.log(`listening at port number ${port}`) ; 
})