const express = require("express");
const router = express.Router();

const {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controllers/expense.controller");
const { authToken } = require("../middlewares/authToken");

router.post("/fetch", authToken, fetchExpenses);
router.post("/create", authToken, createExpense);
router.put("/update", authToken, updateExpense);
router.post("/delete", authToken, deleteExpense);
router.get("/summary", authToken, getExpenseSummary);

module.exports = router;
