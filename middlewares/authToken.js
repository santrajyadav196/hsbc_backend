const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const CustomError = require("../utils/CustomError");

exports.authToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new CustomError("You are not logged in! Please login again", 401)
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decodedToken = jwt.verify(token, process.env.LOGIN_SECRET_KEY);

    // Fetch user
    const user = await User.findById(decodedToken._id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new CustomError("Invalid or expired token", 401));
    }
    next(error); // Forward unexpected errors
  }
};
