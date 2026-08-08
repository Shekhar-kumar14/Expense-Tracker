import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryCard from "../components/SummaryCard";
import Sidebar from "../components/Sidebar";
import { fetchExpenses, createExpense, removeExpense } from "../api";
import "../App.css";
import "../components/Sidebar.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState("");

  const headerRef = useRef(null);
  const formPanelRef = useRef(null);
  const summaryRef = useRef(null);

  // One-time page-load entrance
  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: -12, duration: 0.4, ease: "power2.out" });
    gsap.from(formPanelRef.current, { opacity: 0, y: 16, duration: 0.45, delay: 0.1, ease: "power2.out" });
    gsap.from(summaryRef.current, { opacity: 0, y: 16, duration: 0.45, delay: 0.18, ease: "power2.out" });
  }, []);

  const loadExpenses = async () => {
    try {
      setLoadError("");
      const res = await fetchExpenses();
      setExpenses(res.data);
      setTotal(res.total);
    } catch (err) {
      setLoadError(err.message || "Couldn't load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = async (expense) => {
    setSubmitting(true);
    try {
      await createExpense(expense);
      await loadExpenses();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await removeExpense(id);
      await loadExpenses();
    } catch (err) {
      setLoadError(err.message || "Couldn't delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <div className="app-shell">
          <header className="app-header" ref={headerRef}>
            <div>
              <h1>Expense Tracker</h1>
              <p className="app-sub">Keep a running tab on where your money goes.</p>
            </div>
          </header>

          <main className="app-main">
            <aside className="form-panel" ref={formPanelRef}>
              <ExpenseForm onAdd={handleAdd} submitting={submitting} />
            </aside>

            <section className="list-panel">
              <div ref={summaryRef}>
                <SummaryCard total={total} count={expenses.length} />
              </div>

              {loadError && <p className="form-error">{loadError}</p>}

              {loading ? (
                <p className="loading-text">Loading expenses…</p>
              ) : (
                <ExpenseList expenses={expenses} onDelete={handleDelete} deletingId={deletingId} />
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
