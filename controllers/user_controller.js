const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const { JWT_SECRET, JWT_EXPIRE } = process.env;

// +++++++++++++ HOME PAGE +++++++++++++++++ //
module.exports.homePage = (req, res) => {
  res.render("home", {
    title: "Welcome ! Home Page",
  });
};

// +++++++++++++++ SIGNUP PAGE ++++++++++++++++ //
module.exports.signupPage = (req, res) => {
  res.render("signup", {
    title: "Signup to Me",
  });
};

// +++++++++++++++ LOGIN PAGE ++++++++++++++++ //
module.exports.loginPage = (req, res) => {
  res.render("login", {
    title: "Login",
  });
};

// ++++++++++++++++++ FORGOT PASSWORD PAGE +++++++++++++++ //
module.exports.forgotPasswordPage = (req, res) => {
  res.render("forgot_password", {
    title: "Forgot Password?",
  });
};

// ++++++++++++++++++ RESET PAGE ++++++++++++++++ //
module.exports.resetPage = (req, res) => {
  res.render("reset_password", {
    title: "Reset Your Password",
  });
};

// +++++++++++++++ CREATE NEW USER ++++++++++++++++ //
module.exports.register = async (req, res) => {
  // fetching user details from FORM
  const { fname, lname, email, password } = req.body;

  if (!fname || !lname || !email || !password) {
    req.flash("warning", "Please fill out all fields.");
    res.redirect("back");
  }

  // creating user in db
  const user = await User.create(req.body);

  // To identify and authenticate the user
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    expiresIn: JWT_EXPIRE,
  };

  // creating jwt token here for registering user
  const token = jwt.sign(payload, JWT_SECRET, options);

  res.cookie("token", token, {
    maxAge: 3600000,
    httpOnly: true,
  });

  // Perform registration logic here
  req.flash("success", "Registration successful! Please log in.");
  res.redirect("/page/login");
};

// +++++++++++++++ LOGIN USER ++++++++++++++++ //
module.exports.login = async (req, res) => {
  // token from session store
  let token = req.cookies.token;

  try {
    // verifying token
    const decode = jwt.verify(token, JWT_SECRET);
    console.log(decode);

    // set the userId property of the session to the user's _id
    req.session.userId = decode._id;

    // req.flash("successMessage", "Login successful!");
    res.redirect("/page/home");
  } catch (error) {
    console.log("Error in creating session", error);
    req.flash("errorMessage", "Incorrect email or password.");
    res.redirect("back");
  }
};

// +++++++++++++++ LOGOUT USER ++++++++++++++++ //
module.exports.logout = async (req, res) => {
  // clear the user id from the sessoin
  req.session.userId = null;

  // clear the token from the session
  res.clearCookie("token");

  return res.redirect("/page/login");
};

// ++++++++++++++++++++ FORGOT PASSWORD +++++++++++++++++++++ //
module.exports.forgotPassword = async function (req, res, next) {
  // Finding a user with the specified email in the User collection and
  // waiting for the result before continuing.
  const user = await User.findOne({ email: req.body.email });

  // If user is null or not found
  if (!user) {
    console.log("User not found");
    return;
  }

  // Generating a random key using the crypto.
  const key = crypto.randomBytes(10).toString("hex");
  console.log(key);

  // Saving the user with validateBeforeSave set to false so that we can add the reset password token
  // without triggering the validators for other fields in the user schema.
  await user.save({ validateBeforeSave: false });

  // Constructing the reset password link
  const reset_password_link = `${req.protocol}://${req.get(
    "host"
  )}/reset/password/${key}`;

  // Creating the message to be sent in the password reset email.
  const message = `Your password reset token is : \n\n ${reset_password_link} \n\n if you have not requested this email then, please ignore it.`;

  try {
    // Using the sendEmail function to send an email to the user with the password reset link.
    await sendEmail({
      email: user.email,
      subject: "Nodejs password reset",
      message,
    });

    res.redirect("back");
  } catch (error) {
    // If there was an error sending the email, then we set the resetPasswordToken and resetPasswordExpires
    // fields on the user object to undefined and save the user without validation.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(error);
  }
};

// +++++++++++++++++++ RESET PASSWORD ++++++++++++++++++++++ //
module.exports.resetPassword = async function (req, res, next) {
  // Creating a sha256 hash of the reset password token from the URL parameter.
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Finding a user with the resetPasswordToken value and a resetPasswordExpires value greater than the current date/time.
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  // If user is null
  if (!user) {
    console.log("Reset password token is invalid or has been expired");
  }

  // If the password and confirmPassword fields in the request body do not match, then log the error message and redirect back.
  if (req.body.password !== req.body.confirmPassword) {
    console.log("Password does not match");
    return res.redirect("back");
  }

  // If everything checks out, then set the user's password to the new password,
  // and set the resetPasswordToken and resetPasswordExpires fields to undefined.
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // Saving the user and waiting for the result before continuing.
  await user.save();
};
