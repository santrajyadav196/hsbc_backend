const User = require("../models/user.model");
const CustomError = require("../utils/CustomError");
const { generateLoginAccessToken } = require("../utils/utils");

exports.signupUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = req.body?.email?.toLowerCase();

    const alreadyExist = await User.findOne({ email });
    if (alreadyExist) {
      return next(new CustomError("Email already exists", 400));
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = req.body?.email?.toLowerCase();

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return next(new CustomError("Invalid email or password", 401));
    }

    // compare password is correct or not
    const isPasswordCorrect = await existedUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return next(new CustomError("Invalid email or password", 401));
    }
    const token = generateLoginAccessToken({ _id: existedUser?._id });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      data: {
        _id: existedUser._id,
        name: existedUser.name,
        email: existedUser.email,
        role: existedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Fetched user profile successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
