const Expense = require("../models/expense.model");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

exports.fetchExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.body; // Default values for safety
    const skip = (page - 1) * limit;
    const sort = { createdAt: -1 };

    const filterData = {
      userId: req.user._id,
    };

    const totalExpenses = await Expense.countDocuments(filterData);

    const expenses = await Expense.find(filterData)
      .select("_id amount category date description")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Expense created successfully",
      data: { expenses, totalExpenses },
    });
  } catch (error) {
    next(error);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      amount,
      category,
      date,
      description,
    });

    if (!expense) {
      return next(new CustomError("Expense creation failed", 500));
    }

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      //   data: expense,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, _id } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { userId: req.user._id, _id },
      { amount, category, date, description },
      { new: true }
    );

    if (!expense) {
      return next(new CustomError("Expense not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      //   data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/expenseController.js

exports.deleteExpense = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const deletedExpense = await Expense.findOneAndDelete({
      _id,
      userId: req.user._id,
    });

    if (!deletedExpense) {
      return next(new CustomError("Expense not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Match user's expenses for current month
    const match = {
      userId: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    const summary = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Total monthly amount
    const total = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      data: {
        totalMonthlyExpense: total[0]?.total || 0,
        categoryBreakdown: summary,
      },
    });
  } catch (error) {
    next(error);
  }
};
