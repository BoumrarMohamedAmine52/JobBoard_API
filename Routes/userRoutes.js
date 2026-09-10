const express = require("express");

const Router = express.Router();

const authControllers = require("../Controllers/authController");

Router.route("/signUp").post(authControllers.signUp);
Router.route("/logIn").post(
  authControllers.logInLimiter,
  authControllers.logIn,
);
Router.route("/forgotPassword").post(authControllers.forgotPassword);
Router.route("/resetPassword/:resetToken").patch(authControllers.resetPassword);

Router.route("/updateMyPassword").patch(
  authControllers.protect,
  authControllers.updatePassword,
);
module.exports = Router;
