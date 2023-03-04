const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user_model");

passport.use(
  new LocalStrategy(function (email, password, done) {
    // find the user with this given email address
    User.findOne({ email }, function (err, user) {
      if (err) {
        console.log(`Error in finding user with this email ${email} : ${err}`);
      }

      if (!user || user.password != password) {
        console.log("Invalid Username or Password Entered!");
        return done(null, false);
      }

      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
// deserializeUser called everytime when a route is hit a backend server
passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    if (err) {
      console.log("Error in finding the user");
      return done(err);
    }

    return done(null, user);
  });
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not singed in
  return res.redirect("/page/login");
};

// Set current requested user to local
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
