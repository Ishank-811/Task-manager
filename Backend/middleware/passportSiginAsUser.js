const users = require("../model/usersModel");
var LocalStrategy = require("passport-local").Strategy;
module.exports = {
  initialize: function (passport) {
    passport.use(
      "level1",
      new LocalStrategy(function (username, password, done) {
        users.findOne({ username: username }, function (err, users) {
          if (err) {
            return done(err);
          }
          if (!users) {
            return done(null, false);
          }
          if (users.password != password) {
            return done(null, false);
          }
          console.log(users);
          return done(null, users);
        });
      })
    );
  },
};
