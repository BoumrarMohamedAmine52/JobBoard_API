const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

///
app.use(helmet(npm));

///
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 60 * 1000,
  message: "Too many request, please try later in an hour!",
});

app.use("/api", limiter);

///
app.use(express.json({ limit: "10kb" }));

///
app.use(mongoSanitize());

///
app.use(xss());

//
app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const JobRouter = require("./Routes/jobRoutes");
const userRouter = require("./Routes/userRoutes");
const applicationRouter = require("./Routes/applicationRoutes");
const globalErrorHandler = require("./Controllers/errorController");

app.use("/api/jb1/jobs", JobRouter);
app.use("/api/jb1/users", userRouter);
app.use("/api/jb1/applications", applicationRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `can't find URl : ${req.originalUrl}`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
