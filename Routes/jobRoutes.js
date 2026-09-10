const express = require("express");

const Router = express.Router();

const jobControllers = require("../Controllers/jobController");
const authControllers = require("../Controllers/authController");
const Job = require("../Models/jobModel");

Router.route("/")
  .get(jobControllers.allJobs)
  .post(
    authControllers.protect,
    authControllers.givePermissionTo("employer"),
    jobControllers.setpostedBy,
    jobControllers.addJob,
  );

Router.route("/myJobs").get(
  authControllers.protect,
  authControllers.givePermissionTo("employer"),
  jobControllers.myJobs,
);

Router.route("/job/:id")
  .get(jobControllers.getJob)
  .patch(
    authControllers.protect,
    authControllers.givePermissionTo("employer"),
    authControllers.restrictToOwnerOnly(Job),
    jobControllers.updateJob,
  )
  .delete(
    authControllers.protect,
    authControllers.givePermissionTo("employer"),
    authControllers.restrictToOwnerOnly(Job),
    jobControllers.deleteJob,
  );

module.exports = Router;
