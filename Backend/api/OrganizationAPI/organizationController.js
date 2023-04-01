const users = require("../../model/usersModel");

const registeringUsers = function (req, res) {
  console.log(req.body); 
  users
    .findOne({ "organization.organizationId": req.user._id  , username: req.body.username })
    .then(function (userdetail) {
      if (userdetail) {
        res.status(404).send("Employee already exist");
      } else {
        var response = new users({
          organization: {
            name: req.user.organizationName,
            organizationId: req.user._id,
          },
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
        });
        response
          .save()
          .then(function () {
            res.status(202).send(response);
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

const fetchingUsers = function (req, res) {
  if (req.user.valid == true) {
    var id = req.user._id;
    users
      .find({ "organization.organizationId": id })
      .then(function (data) {
        res
          .status(202)
          .json({ usersdata: data, roleAsOrganization: true, validity: true , adminId:id});
      })
      .catch(function (e) {
        console.log(e);
      });
  } else if (!req.user.valid) {
    res.status(404).json({ validity: false });
  }
};

const updatingUser = function (req, res) {
  // var updateUser = {
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   username: req.body.username,
  //   password: req.body.password,
  //   role: req.body.role,
  // };
  // users
  //   .findByIdAndUpdate(req.params.id, updateUser, { new: true })
  //   .then(function (userdetail) {
  //     console.log(userdetail);
  //   })
  //   .catch(function (err) {
  //     console.log(err);
  //   });

};

const searchUser = function(req,res){
const regex = new RegExp(req.query.value, 'i');
users.find({ "organization.organizationId": req.query.adminId,
username:regex}).then(function(response){
  res.status(200).send(response); 
}).catch(function(error){
  console.log(error); 
})


}

module.exports = { registeringUsers, fetchingUsers, updatingUser , searchUser };
