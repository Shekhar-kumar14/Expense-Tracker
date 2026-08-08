import { useEffect, useRef } from "react";
import gsap from "gsap";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export default function SummaryCard({ total, count }) {
  const amountRef = useRef(null);
  const valueRef = useRef(0);

  // Animate the total counting up/down to the new value whenever it changes
  useEffect(() => {
    const obj = { val: valueRef.current };
    gsap.to(obj, {
      val: total || 0,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        if (amountRef.current) amountRef.current.textContent = formatCurrency(obj.val);
      },
      onComplete: () => {
        valueRef.current = total || 0;
      },
    });
  }, [total]);

  return (
    <div className="summary-card">
      <div>
        <p className="summary-label">Total spent</p>
        <p className="summary-amount" ref={amountRef}>
          {formatCurrency(total || 0)}
        </p>
      </div>
      <div className="summary-count">
        {count} {count === 1 ? "expense" : "expenses"}
      </div>
    </div>
  );
}
