import { useState } from "react";
import { CATEGORIES } from "../categories";

const todayISO = () => new Date().toISOString().slice(0, 10);

const initialState = {
  amount: "",
  description: "",
  category: "Food",
  date: todayISO(),
};

export default function ExpenseForm({ onAdd, submitting }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description can't be empty.");
      return;
    }
    if (!form.date) {
      setError("Pick a date.");
      return;
    }

    try {
      await onAdd({
        amount: amountNum,
        description: form.description.trim(),
        category: form.category,
        date: form.date,
      });
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Couldn't add expense. Try again.");
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <h2 className="panel-title">Add expense</h2>

      <div className="field">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. Groceries"
          maxLength={120}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Adding…" : "Add expense"}
      </button>
    </form>
  );
}
