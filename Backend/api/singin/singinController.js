const jwt = require("jsonwebtoken");
const organization = require("../../model/oganizationModel");
const users = require("../../model/usersModel");
const singinAsOrganization = function (req, res) {
  organization
    .findOne({
      organizationUsername: req.user.organizationUsername,
      organizationPassword: req.user.organizationPassword,
    })
    .then(function (organizationDetail) {
      if (organizationDetail) {
       
        var dataToSendForJwt = {
          id: organizationDetail._id,
          roleAsOrganization: true,
          username: organizationDetail.organizationUsername,
        };
        const token = jwt.sign(dataToSendForJwt, "random string", {
          expiresIn: "1d",
        });
       
        return res.json({ token, roleAsOrganization: true });
      } else {
        res.status(404).send({ message: "user not authorized" });
      }
    })
    .catch(function (e) {
      console.log(e);
    });
};

const singinAsUsers = function (req, res) {
  if (req.user) {
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
    return res.status(202).json({ token, role: req.user.role });
  } else {
    res.status(404).send({ message: "user not authorized" });
  }
};
module.exports = { singinAsOrganization, singinAsUsers };
