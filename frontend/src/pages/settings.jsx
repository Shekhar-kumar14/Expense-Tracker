import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../components/Sidebar.css";
import "./auth.css";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = request OTP, 2 = enter OTP + new password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await forgotPassword({ email: user.email });
      setSuccess("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await resetPassword({ email: user.email, otp, newPassword });
      setSuccess("Password changed successfully!");
      setOtp("");
      setNewPassword("");
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-content">
        <div className="auth-container" style={{ minHeight: "100vh" }}>
          <div className="auth-card">
            <h2>Settings</h2>
            <p className="auth-subtext">
              Logged in as <strong>{user?.email}</strong>
            </p>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            {step === 1 && (
              <>
                <p className="auth-subtext" style={{ marginBottom: "18px" }}>
                  To change your password, we'll send a one-time OTP to your registered email.
                </p>
                <button className="auth-btn" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP to reset password"}
                </button>
              </>
            )}

            {step === 2 && (
              <form className="auth-form" onSubmit={handleReset}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
