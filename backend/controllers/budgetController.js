const Budget = require("../models/Budget");

// @route GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json({ data: budgets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/budgets
// body: { category, monthlyLimit }
// Creates the budget if it doesn't exist, updates it if it does.
exports.setBudget = async (req, res) => {
  try {
    const { category, monthlyLimit } = req.body;

    if (!category || monthlyLimit === undefined) {
      return res.status(400).json({ message: "Category and monthlyLimit are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category },
      { monthlyLimit },
      { new: true, upsert: true }
    );

    res.json({ message: "Budget saved", data: budget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
