const express = require("express");
const router = express.Router();
const passport = require("../configs/passport-local");
const {
  signupPage,
  loginPage,
  register,
  homePage,
  login,
  logout,
  resetPage,
  forgotPassword,
  forgotPasswordPage,
  resetPassword,
} = require("../controllers/user_controller");

// GET request for home page
router.route("/page/home").get(homePage);

// GET request for signup page
router.route("/page/signup").get(signupPage);

// GET request for login page
router.route("/page/login").get(loginPage);

// GET request for forgot password page
router.route("/page/forgot_password").get(forgotPasswordPage);

// POST request to register a new user
router.route("/register").post(register);

// POST request to log in an existing user
router.route("/login").post(login);

// GET request to log out the user
router.route("/logout").get(logout);

// POST request to initiate a password reset
router.route("/password/forgot").post(forgotPassword);

// PUT request to reset a user's password
// GET request to display reset password page
router.route("/reset/password/:token").put(resetPassword).get(resetPage);

// Google authentication routes

// GET request to initiate Google authentication flow
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// GET request to handle Google authentication callback
router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "/page/home",
    failureRedirect: "/page/login",
  })
);

module.exports = router;
