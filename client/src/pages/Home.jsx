import React, { useState } from "react";
import "../styles/pages/Home.css";

const Home = ({ setPage }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="home">

      {/* TOPBAR */}
      <div className="topbar">
        <span className="menu-icon" onClick={() => setOpen(true)}>☰</span>
        <h2 className="logo">CertChain</h2>
        <div className="nav-right">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("verify")}>Verify</button>
          <button className="login-btn" onClick={() => setPage("login")}>Login</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <span className="close" onClick={() => setOpen(false)}>×</span>
        <h2>CertChain</h2>
        <ul>
          <li onClick={() => { setPage("dashboard");    setOpen(false); }}>Dashboard</li>
          <li onClick={() => { setPage("upload");       setOpen(false); }}>Upload Certificate</li>
          <li onClick={() => { setPage("certificates"); setOpen(false); }}>Certificates</li>
          <li onClick={() => { setPage("verify");       setOpen(false); }}>Verify</li>
          <li onClick={() => { setPage("login");        setOpen(false); }}>Login</li>
        </ul>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Secure Certificate Verification</h1>
            <p>
              CertChain uses blockchain technology to ensure the authenticity,
              integrity, and security of educational certificates.
            </p>
            <div className="buttons">
              {/* ✅ FIXED */}
              <button className="btn primary" onClick={() => setPage("signup")}>
                Get Started
              </button>
              <button
                className="btn secondary"
                onClick={() => setPage("verify")}
                style={{ marginLeft: "12px" }}
              >
                Verify Certificate
              </button>
            </div>
          </div>
          <div className="hero-right">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt=""
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="card">
          <h3>Secure</h3>
          <p>Blockchain powered security ensures tamper-proof certificates.</p>
        </div>
        <div className="card">
          <h3>Instant Verification</h3>
          <p>Verify certificates instantly with a unique verification ID.</p>
        </div>
        <div className="card">
          <h3>Trusted</h3>
          <p>Reliable and trusted by institutions worldwide.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;