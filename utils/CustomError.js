class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Pass the message to the base Error class
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false; // Always false for errors
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // Clean stack trace
  }
}

module.exports = CustomError;
