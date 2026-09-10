const mongoose = require("mongoose");
const User = require("./userModel");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "the job posting must have a title"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "the job posting must have alocation"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["full-time", "remote", "part-time", "contract"],
        message:
          "The job type must be either full-time, remote, part-time or contract",
      },
      required: [true, "The job must have a type"],
    },
    company: {
      type: String,
      required: [true, "The job must belong to a company"],
      trim: true,
    },
    roleSummary: {
      type: String,
    },
    keyResponsibilities: {
      type: [String],
      required: [true, "The job posting must mention key responsibilities"],
    },
    qualifications: {
      type: [String],
      required: [true, "the job must mention a qualifications"],
    },
    skills: {
      type: [String],
    },
    salaryMax: {
      type: Number,
      required: [true, "the job posting must mention the max salary"],
    },
    salaryMin: {
      type: Number,
      required: [true, "the job posting must mention the min salary"],
    },
    benefits: {
      type: [String],
    },
    applyingMethod: {
      type: [String],
      required: [true, "the job posting must have applying method(s)"],
    },
    jobStatus: {
      type: String,
      enum: {
        values: ["open", "closed", "paused"],
        message: "the job posting must be either open, closed or paused",
      },
      default: "open",
    },
    applicationDeadline: {
      type: Date,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "the job must belong to an employer"],
    },
  },
  {
    timestamps: true, // 👈 this alone replaces both manual fields
  },
);

jobSchema.pre(/^find/, function () {
  this.populate({
    path: "postedBy",
    select: "fullName company email -_id",
  });
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
