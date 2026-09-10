const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: [true, "the user must have a full name"],
  },
  email: {
    type: String,
    required: [true, "the user must have an email."],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "The user must provide a password"],
    minlength: [8, "the password must have at least 8 characters."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm ur password"],
    validate: {
      // this works only on .create() / .save()
      validator: function (el) {
        return el === this.password;
      },
      message: "the passwords are not the same.",
    },
    //select: false,
  },
  phoneNumber: {
    type: String,
  },
  location: {
    type: String,
  },
  CandidateProfile: {
    workExperience: [
      {
        jobTitle: { type: String },
        companyName: { type: String },
        dates: { type: String },
        _id: false,
      },
    ],
    coreSkills: {
      type: [String],
    },
    education: {
      type: [String],
    },
    portfolioLinks: {
      type: [String],
    },
  },
  role: {
    type: String,
    enum: {
      values: ["employer", "candidate"],
      message: "the user role must be either employer candidate",
    },
    default: "candidate",
  },
  profilePicture: { type: String },
  passwordChangedDate: {
    type: Date,
  },
  resetToken: {
    type: String,
  },
  expiredresetTokenDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  company: {
    type: String,
  },
});

// Pattern A: async, no next() call needed at all
// the next() become optional in async function .
//Since Mongoose 5+, when you pass an async function to pre('save', ...),
// Mongoose is smart enough to recognize it as an async function and waits for the returned Promise to resolve —
// completion is signaled automatically when the function finishes running, not by calling next().
// Calling next() becomes optional, not required.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTtimestamp) {
  if (this.passwordChangedDate) {
    // devide by 1000 because JWTtimestamp or token iat is in seconds
    // and not in millseconds .
    const passwordChangedDateTimestamp = parseInt(
      this.passwordChangedDate.getTime() / 1000,
      10,
    );
    return passwordChangedDateTimestamp > JWTtimestamp;
  }

  return false;
};

userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedDate = Date.now() - 1000;
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.resetToken);
  this.expiredresetTokenDate = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.CandidateProfile && ret.CandidateProfile.workExperience) {
      ret.CandidateProfile.workExperience.forEach((exp) => {
        delete exp._id;
      });
    }
    return ret;
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
