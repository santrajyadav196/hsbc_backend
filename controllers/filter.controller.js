const Expense = require("../models/expense.model");

exports.filterExpenses = async (req, res, next) => {
  try {
    const { category } = req.body;

    let filterData = {};

    if (category !== "All") {
      filterData = { ...filterData, category };
    }

    const data = await Expense.find(filterData);

    return res.json({
      success: true,
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
