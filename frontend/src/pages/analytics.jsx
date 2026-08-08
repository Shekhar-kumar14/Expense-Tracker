
import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { fetchExpenses, fetchBudgets, setBudget as saveBudget } from "../api";
import "../components/Sidebar.css";
import "./Analytics.css";

const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Bills: "#ef4444",
  Entertainment: "#8b5cf6",
  Health: "#10b981",
  Other: "#6b7280",
};

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetForm, setBudgetForm] = useState({ category: "Food", monthlyLimit: "" });
  const [savingBudget, setSavingBudget] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [expRes, budRes] = await Promise.all([fetchExpenses(), fetchBudgets()]);
      setExpenses(expRes.data);
      setBudgets(budRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Category-wise total spend (all time) - for pie chart
  const categoryData = useMemo(() => {
    const totals = {};
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // Monthly trend - last 6 months - for line chart
  const monthlyData = useMemo(() => {
    const totals = {};
    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      totals[key] = (totals[key] || 0) + exp.amount;
    });
    return Object.entries(totals)
      .map(([month, total]) => ({ month, total }))
      .slice(-6);
  }, [expenses]);

  // This month's spend per category - for budget progress bars
  const thisMonthByCategory = useMemo(() => {
    const now = new Date();
    const totals = {};
    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
      }
    });
    return totals;
  }, [expenses]);

  async function handleBudgetSubmit(e) {
    e.preventDefault();
    setSavingBudget(true);
    setError("");
    try {
      await saveBudget({
        category: budgetForm.category,
        monthlyLimit: Number(budgetForm.monthlyLimit),
      });
      setBudgetForm({ category: "Food", monthlyLimit: "" });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingBudget(false);
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-content">
        <div className="analytics-shell">
          <header className="analytics-header">
            <h1>Analytics</h1>
            <p className="app-sub">See where your money goes and track your budgets.</p>
          </header>

          {error && <p className="form-error">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <>
              <div className="chart-grid">
                <div className="chart-card">
                  <h3>Spending by category</h3>
                  {categoryData.length === 0 ? (
                    <p className="empty-hint">No expenses yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={(entry) => entry.name}
                        >
                          {categoryData.map((entry) => (
                            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="chart-card">
                  <h3>Monthly trend</h3>
                  {monthlyData.length === 0 ? (
                    <p className="empty-hint">No expenses yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="budget-section">
                <h3>Monthly budgets</h3>

                <form className="budget-form" onSubmit={handleBudgetSubmit}>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Monthly limit (₹)"
                    min="0"
                    value={budgetForm.monthlyLimit}
                    onChange={(e) => setBudgetForm({ ...budgetForm, monthlyLimit: e.target.value })}
                    required
                  />
                  <button className="btn-primary" type="submit" disabled={savingBudget}>
                    {savingBudget ? "Saving..." : "Set budget"}
                  </button>
                </form>

                {budgets.length === 0 ? (
                  <p className="empty-hint">No budgets set yet.</p>
                ) : (
                  <div className="budget-list">
                    {budgets.map((b) => {
                      const spent = thisMonthByCategory[b.category] || 0;
                      const pct = Math.min((spent / b.monthlyLimit) * 100, 100);
                      const overBudget = spent > b.monthlyLimit;
                      return (
                        <div className="budget-item" key={b._id}>
                          <div className="budget-item-top">
                            <span className="budget-category">{b.category}</span>
                            <span className={overBudget ? "budget-amounts over" : "budget-amounts"}>
                              ₹{spent.toFixed(2)} / ₹{b.monthlyLimit.toFixed(2)}
                            </span>
                          </div>
                          <div className="budget-bar-track">
                            <div
                              className={overBudget ? "budget-bar-fill over" : "budget-bar-fill"}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {overBudget && (
                            <p className="budget-warning">
                              You've exceeded your {b.category} budget this month.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
