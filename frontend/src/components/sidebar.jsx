import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="sidebar-mobile-bar">
        <h2 className="sidebar-logo">💰 Expense Tracker</h2>
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && <div className="sidebar-overlay" onClick={closeMenu} />}

      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="sidebar-top">
          <h2 className="sidebar-logo sidebar-logo-desktop">💰 Expense Tracker</h2>

          <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
              onClick={closeMenu}
            >
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
              onClick={closeMenu}
            >
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
          <button className="sidebar-logout" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
