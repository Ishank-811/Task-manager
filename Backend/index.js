const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./config/db");
const passport = require("passport");
const port = 8080;

conn();
app.use(passport.initialize());

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
var multer = require("multer");


app.get("/" , function(req,res){
  res.send("app is running");
})
app.use("/", require("./api/singup/singupRoutes"));

app.use("/signinAsUser", require("./api/singin/singinAsUsersRoute"));
app.use("/organization", require("./api/OrganizationAPI/organizationRoutes"));
app.use("/admin", require("./api/admin/adminroutes"));
app.use("/manager", require("./api/manager/managerRoute"));
app.use("/employee", require("./api/employee/employeeRoutes"));
app.use("/superAdmin", require("./api/superAdmin/superAdminRoutes"));

app.listen(port, function(){
  console.log(`listening at port number ${port}`);
});
