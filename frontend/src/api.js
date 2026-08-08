const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Something went wrong");
  }
  return body;
}

// ---------- Expense APIs (protected - token required) ----------

export async function fetchExpenses() {
  const res = await fetch(`${API_URL}/expenses`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

export async function createExpense(expense) {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function removeExpense(id) {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

// ---------- Budget APIs (protected - token required) ----------

export async function fetchBudgets() {
  const res = await fetch(`${API_URL}/budgets`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

export async function setBudget(data) {
  const res = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBudget(id) {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

// ---------- Auth APIs (public - no token needed) ----------

export async function signup(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function verifyOtp(data) {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function login(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function forgotPassword(data) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function resetPassword(data) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
