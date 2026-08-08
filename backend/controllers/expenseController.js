const Expense = require("../models/Expense");

// @desc    Get all expenses for the logged-in user (newest first) + total amount
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.status(200).json({ success: true, count: expenses.length, total, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch expenses", error: err.message });
  }
};

// @desc    Add a new expense for the logged-in user
// @route   POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    const expense = await Expense.create({
      amount,
      description,
      category,
      date,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Failed to add expense", error: err.message });
  }
};

// @desc    Delete an expense (only if it belongs to the logged-in user)
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    await expense.deleteOne();
    res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense id" });
    }
    res.status(500).json({ success: false, message: "Failed to delete expense", error: err.message });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };
