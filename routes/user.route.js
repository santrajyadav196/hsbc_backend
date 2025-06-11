const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  getUserProfile,
} = require("../controllers/user.controller");
const { authToken } = require("../middlewares/authToken");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", authToken, getUserProfile);

module.exports = router;
