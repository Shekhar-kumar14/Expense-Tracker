# Expense Tracker (MERN)

A simple full-stack expense tracker: add expenses, see them listed, view the
running total, and delete entries.

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)

## Project structure

```
expense-tracker/
├── backend/          Express REST API
│   ├── config/db.js
│   ├── controllers/expenseController.js
│   ├── models/Expense.js
│   ├── routes/expenses.js
│   ├── server.js
│   └── .env.example
└── frontend/          React app (Vite)
    ├── src/
    │   ├── components/ (ExpenseForm, ExpenseList, ExpenseItem, SummaryCard)
    │   ├── App.jsx / App.css
    │   ├── api.js
    │   └── categories.js
    └── .env.example
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
CLIENT_URL=http://localhost:5173
```

- If you're using **local MongoDB**, make sure `mongod` is running, and the
  URI above works as-is.
- If you're using **MongoDB Atlas**, paste your connection string (with
  username/password) as `MONGO_URI`.

Run the server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```

The API runs at `http://localhost:5000`.

### API endpoints

| Method | Route               | Description          |
|--------|----------------------|-----------------------|
| GET    | `/api/expenses`      | Get all expenses + total |
| POST   | `/api/expenses`      | Add a new expense     |
| DELETE | `/api/expenses/:id`  | Delete an expense     |

**POST body example:**
```json
{
  "amount": 250,
  "description": "Groceries",
  "category": "Food",
  "date": "2026-07-29"
}
```

Categories allowed: `Food`, `Transport`, `Shopping`, `Bills`,
`Entertainment`, `Health`, `Other`.

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should point at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Features

- Add expense form (amount, description, category, date) with inline validation
- List of all expenses, newest first
- Total amount spent, updated live
- Delete an expense with one click
- Responsive layout (single column on mobile, sidebar + list on desktop)

## Notes

- CORS on the backend is restricted to `CLIENT_URL` from `.env` — update it
  if you deploy the frontend elsewhere.
- To reset the data, just clear the `expenses` collection in MongoDB.
