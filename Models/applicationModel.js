const mongoose = require("mongoose");
const User = require("./userModel");
const Job = require("./jobModel");

const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "the application must belong to a user."],
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
    required: [true, "the application must belong to a job."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "reviewed", "accepted", "rejected"],
      message:
        "the status must be either pending, reviewed, accepted or rejected",
    },
    default: "pending",
  },
});

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

applicationSchema.pre(/^find/, function () {
  this.populate([
    {
      path: "candidate",
      select: "fullName email phoneNumber CandidateProfile",
    },
    { path: "job", select: "title company type location" },
  ]);
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
