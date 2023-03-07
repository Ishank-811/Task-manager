const organization = require("../../model/oganizationModel");

const registerAsorganization = (req, res) => {
  organization
    .findOne({ email: req.body.email })
    .then(function (userdetail) {
      if (userdetail) {
        console.log("user already exsist");
      } else {
        var response = new organization({
          organizationUsername: req.body.email,
          organizationPassword: req.body.password,
          organizationName: req.body.organizationName,
        });
        response
          .save()
          .then(function () {
            res.send(response);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    })
    .catch(function (e) {
      console.log(e);
    });
};

module.exports = { registerAsorganization };
