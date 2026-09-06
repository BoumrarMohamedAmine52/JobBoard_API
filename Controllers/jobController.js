const Job = require("../Models/jobModel");
const User = require("../Models/userModel");
const AppError = require("../Utils/AppError");
const asyncHandler = require("express-async-handler");

exports.getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find();

  res.status(200).json({
    status: "Success",
    data: {
      jobs,
    },
  });
});

exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      job,
    },
  });
});

exports.addJob = asyncHandler(async (req, res, next) => {
  // save the new job in the db
  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: "Success",
    data: {
      newJob,
    },
  });
});

exports.updateJob = asyncHandler(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    return next(new AppError("No job found with that id.", 404));
  }
  res.status(201).json({
    status: "Success",
    data: {
      updatedJob,
    },
  });
});

exports.deleteJob = asyncHandler(async (req, res, next) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);

  if (!deletedJob) {
    return next(new AppError("No job found with that id.", 404));
  }

  res.status(204).json({
    status: "Success",
  });
});

exports.myJobs = asyncHandler(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user.id });

  if (!myJobs) {
    return next(new AppError("U didn't post any jobs offer yet.", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      myJobs,
    },
  });
});

exports.setpostedBy = (req, res, next) => {
  if (!req.body.postedBy) req.body.postedBy = req.user.id;
  next();
};
