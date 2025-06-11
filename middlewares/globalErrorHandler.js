const globalErrorHandler = (err, req, res, next) => {
  const isDev = process.env.MODE === "development";

  const statusCode = err.statusCode ? err.statusCode : 500;
  const success = false; // Always false for errors
  const message = err.message || "Internal Server Error";

  if (isDev) {
    return res.status(statusCode).json({
      success,
      message,
      error: err,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(statusCode).json({ success, message });
  }

  // Unexpected errors
  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success,
    message: "Something went wrong",
  });
};

module.exports = globalErrorHandler;
