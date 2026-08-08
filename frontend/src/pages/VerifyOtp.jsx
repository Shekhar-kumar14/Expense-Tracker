import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtp } from "../api";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const email = location.state?.email;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email missing. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp({ email, otp });
      loginUser(data); // logs the user in immediately after verification
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Email</h2>
        <p className="auth-subtext">
          Enter the 6-digit OTP sent to <strong>{email || "your email"}</strong>
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="auth-footer">
          Didn't get the code? <Link to="/signup">Try signing up again</Link>
        </p>
      </div>
    </div>
  );
}
