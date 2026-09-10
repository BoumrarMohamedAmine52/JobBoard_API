const AppError = require("../Utils/AppError");

const validationErrorsHandler = (err) => {
  const msgs = Object.values(err.errors).map((el) => el.message);

  const message = msgs.join(", ");

  return new AppError(message, 400);
};

const castastErrorsHandler = (err) => {
  const msg = `Invalid ${err.path} : ${err.value}`;
  return new AppError(msg, 400);
};

const duplicateFieldsErrorHandler = (err) => {
  const value = Object.keys(err.keyValue)[0];
  const msg = `Duplicated field ${value}, please use another value.`;

  return new AppError(msg, 400);
};

const JWTErrorHandler = (err) => {
  const msg = `Invalid Token, please login again.`;
  return new AppError(msg, 401);
};

const JWTExpiredErrorHandler = (err) => {
  const msg = "Your Token has been expired, please log in.";
  return new AppError(msg, 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  return res.status(err.statusCode).json({
    status: "error",
    message: "semething went wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //console.log(err.name);

    let error = { ...err, name: err.name };
    //console.log(error);
    if (error.name === "ValidationError")
      error = validationErrorsHandler(error);
    if (error.name === "CastError") error = castastErrorsHandler(error);
    if (error.code === 11000) error = duplicateFieldsErrorHandler(error);
    if (error.name === "JsonWebTokenError") error = JWTErrorHandler(error);
    if (err.name === "TokenExpiredError") error = JWTExpiredErrorHandler(error);
    sendErrorProd(error, res);
  }
};
