var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
var passport = require("passport");
var organization = require("../model/oganizationModel");
var users = require("../model/usersModel");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "random string";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
 
    organization.findOne(
      { organizationUsername: jwt_payload.username },
      function (err, organization) {
        if (err) {
          return done(err, false);
        }
        if (organization) {
        
          return done(null, organization);
        } else {
          return done(null, { valid: false });
        }
      }
    );
  })
);
passport.use(
  "level2",
  new JwtStrategy(opts, function (jwt_payload, done) {
    users.findOne(
      { username: jwt_payload.username },
      function (err, organization) {
        if (err) {
          return done(err, false);
        }
        if (organization) {
          return done(null, organization);
        } else {
          return done(null, { valid: false });
        }
      }
    );
  })
);
