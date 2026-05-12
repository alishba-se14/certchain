import React, { useState } from "react";
import "../styles/pages/Login.css";
import { loginUser } from "../services/api";

function Login({ setPage }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await loginUser({ email, password });

      // save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data));

      setLoading(false);
      setPage("dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back
        </button>

        <h2 className="logo">CertChain</h2>
        <h3>Welcome Back</h3>
        <p className="subtitle">Login to your account to continue</p>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{
            background:   "#fee2e2",
            color:        "#dc2626",
            padding:      "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize:     "13px"
          }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot">
            <span
              style={{ color: "#2b6cb0", cursor: "pointer", fontSize: "12px" }}
              onClick={() => setPage("forgotpassword")}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => setPage("signup")}>Sign up</span>
        </p>

      </div>
    </div>
  );
}

export default Login;