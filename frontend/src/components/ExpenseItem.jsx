import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { categoryColor } from "../categories";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function ExpenseItem({ expense, onDelete, deleting, delay = 0 }) {
  const itemRef = useRef(null);
  const [removing, setRemoving] = useState(false);

  // Entrance animation — runs once when the row mounts (new item or initial list)
  useEffect(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, y: -10, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out", delay }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Exit animation — plays before the item is actually removed from state
  const handleDelete = () => {
    if (removing) return;
    setRemoving(true);
    gsap.to(itemRef.current, {
      opacity: 0,
      x: 40,
      scale: 0.96,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onDelete(expense._id),
    });
  };

  return (
    <li ref={itemRef} className="expense-item">
      <span className="cat-dot" style={{ background: categoryColor(expense.category) }} aria-hidden="true" />
      <div className="expense-main">
        <p className="expense-desc">{expense.description}</p>
        <p className="expense-meta">
          {expense.category} · {formatDate(expense.date)}
        </p>
      </div>
      <span className="expense-amount">{formatCurrency(expense.amount)}</span>
      <button
        className="btn-delete"
        onClick={handleDelete}
        disabled={deleting || removing}
        aria-label={`Delete ${expense.description}`}
        title="Delete expense"
      >
        {deleting ? "…" : "✕"}
      </button>
    </li>
  );
}
