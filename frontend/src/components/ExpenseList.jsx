import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({ expenses, onDelete, deletingId }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet.</p>
        <p className="empty-sub">Add your first one using the form.</p>
      </div>
    );
  }

  return (
    <ul className="expense-list">
      {expenses.map((exp, index) => (
        <ExpenseItem
          key={exp._id}
          expense={exp}
          onDelete={onDelete}
          deleting={deletingId === exp._id}
          delay={Math.min(index * 0.04, 0.3)}
        />
      ))}
    </ul>
  );
}
