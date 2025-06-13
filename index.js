require("dotenv").config();
require("./config/db")();
const express = require("express");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const CustomError = require("./utils/CustomError");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

const userRoutes = require("./routes/user.route");
const expenseRoutes = require("./routes/expense.route");
const filterExpense = require("./routes/filter.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public folder

const corsOptions = {
  // origin: "http://localhost:5173", // Change this to your frontend URL
  origin: "*", // Allow all origins
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/filter", filterExpense);

// catch url not found and forward to error handler
app.all("*wildcard", (req, res, next) => {
  const message =
    process.env.MODE === "development"
      ? `URL not found: ${req.originalUrl}`
      : "Something went wrong";

  next(new CustomError(message, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
