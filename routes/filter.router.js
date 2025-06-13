const express = require("express");

const router = express.Router();

const { filterExpenses } = require("../controllers/filter.controller");
const { authToken } = require("../middlewares/authToken");

router.post("/expenses", authToken, filterExpenses);

module.exports = router;
