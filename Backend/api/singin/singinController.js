const jwt = require("jsonwebtoken");
const singinAsUsers = function (req, res) {
  if (req.user) {
    if(!(req.user.isDeleted)){
    var dataToSendForJwt = {
      id: req.user._id,
      organization: req.user.organization,
      role: req.user.role,
      username: req.user.username,
    };
    const token = jwt.sign(dataToSendForJwt, "random string", {
      expiresIn: "1d",
    });
    console.log(token);
    return res.status(202).json({ token, role: req.user.role , organizationDetails:req.user.organization.name ,username:req.user.username  });
  }else{
    res.status(404).send({ message: "user is Disabled , contact admin" });
  } } 

  else {
    res.status(404).send({ message: "user not authorized" });
  }
};
module.exports = {singinAsUsers };
