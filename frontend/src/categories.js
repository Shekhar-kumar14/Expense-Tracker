export const CATEGORIES = [
  { name: "Food", color: "#F59E0B" },
  { name: "Transport", color: "#3B82F6" },
  { name: "Shopping", color: "#EC4899" },
  { name: "Bills", color: "#8B5CF6" },
  { name: "Entertainment", color: "#F43F5E" },
  { name: "Health", color: "#10B981" },
  { name: "Other", color: "#6B7686" },
];

export function categoryColor(name) {
  return CATEGORIES.find((c) => c.name === name)?.color || "#6B7686";
}
