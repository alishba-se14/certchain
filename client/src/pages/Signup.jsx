import React, { useState } from "react";
import "../styles/pages/Signup.css";
import { registerUser } from "../services/api";

function Signup({ setPage }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await registerUser({ name, email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data));

      setLoading(false);
      setPage("dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <button className="back-btn" onClick={() => setPage("login")}>
          ← Back
        </button>

        <h2 className="logo">CertChain</h2>
        <h3>Create Account</h3>
        <p className="subtitle">Sign up to get started</p>

        {/* ERROR MESSAGE — shows only when error */}
        {error && (
          <div style={{
            background:   "#fee2e2",
            color:        "#dc2626",
            padding:      "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize:     "13px",
            textAlign:    "left"
          }}>
            ❌ {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSignup}>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <span onClick={() => setPage("login")}>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Signup;