const Application = require("../Models/applicationModel");
const Job = require("../Models/jobModel");
const AppError = require("../Utils/AppError");
const asyncHandler = require("express-async-handler");

// exports.getApplications = asyncHandler(async (req, res, next) => {
//   const applications = await Application.find();

//   res.status(200).json({
//     status: "Success",
//     data: {
//       applications,
//     },
//   });
// });

exports.getApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(new AppError("No application found with that id.", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      application,
    },
  });
});

exports.myApplications = asyncHandler(async (req, res, next) => {
  const myApps = await Application.find({ candidate: req.user.id });

  if (!myApps) {
    return next(new AppError("U didn't apply to any job offer yet.", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      myApps,
    },
  });
});

exports.updateMyApplication = asyncHandler(async (req, res, next) => {
  const updatedApplication = await Application.findByIdAndUpdate(
    req.params.id,
    {
      coverLetter: req.body.coverLetter,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedApplication) {
    return next(new AppError("No application found with that id", 404));
  }

  res.status(201).json({
    status: "Success",
    data: {
      updatedApplication,
    },
  });
});

exports.deleteMyApplication = asyncHandler(async (req, res, next) => {
  const deletedApp = await Application.findByIdAndDelete(req.params.id);

  if (!deletedApp) {
    return next(new AppError("No application found with that ID.", 404));
  }

  res.status(204).json({
    status: "Success",
  });
});

exports.jobApplications = asyncHandler(async (req, res, next) => {
  const jobApplications = await Application.find({
    job: req.params.id,
  });

  if (!jobApplications) {
    return next(new AppError("No candidate applied for this job yet.", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      jobApplications,
    },
  });
});

exports.setJobCandidateID = (req, res, next) => {
  if (!req.body.job) req.body.job = req.params.id;
  if (!req.body.candidate) req.body.candidate = req.user.id;
  next();
};

exports.addApplication = asyncHandler(async (req, res, next) => {
  const newApplication = await Application.create(req.body);

  res.status(201).json({
    status: "Success",
    data: {
      newApplication,
    },
  });
});

exports.applicationStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const updatedApplication = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(201).json({
    status: "Success",
    data: {
      updatedApplication,
    },
  });
});
