import React, { useState } from "react";
import "../styles/pages/Dashboard.css";

function Dashboard({ setPage }) {
  const [open, setOpen] = useState(false);

  return (
    <div>

      {/* TOPBAR */}
      <div className="topbar">
        <span className="menu-icon" onClick={() => setOpen(true)}>☰</span>
        <h2 className="logo">CertChain</h2>
        <div className="nav-right">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("verify")}>Verify</button>
          <button onClick={() => setPage("login")} className="login-btn">Login</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <span className="close" onClick={() => setOpen(false)}>×</span>
        <h2>CertChain</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li onClick={() => { setPage("upload");       setOpen(false); }}>Upload Certificate</li>
          <li onClick={() => { setPage("certificates"); setOpen(false); }}>Certificates</li>
          <li onClick={() => { setPage("verify");       setOpen(false); }}>Verify</li>
          <li onClick={() => { setPage("blockchain");   setOpen(false); }}>Blockchain Ledger</li>
          <li onClick={() => { setPage("home");         setOpen(false); }}>Logout</li>
        </ul>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* MAIN */}
      <div className="main">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Overview of your certificate management system</p>
          </div>
          <span className="admin">Admin</span>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-card" onClick={() => setPage("certificates")} style={{ cursor: "pointer" }}>
            <div className="icon blue">📄</div>
            <h3>128</h3>
            <p>Total Certificates</p>
            <span className="positive">↑ 12% from last month</span>
          </div>
          <div className="stat-card" onClick={() => setPage("certificates")} style={{ cursor: "pointer" }}>
            <div className="icon green">✔</div>
            <h3>96</h3>
            <p>Verified Certificates</p>
            <span className="positive">↑ 15% from last month</span>
          </div>
          <div className="stat-card" onClick={() => setPage("certificates")} style={{ cursor: "pointer" }}>
            <div className="icon orange">⏱</div>
            <h3>24</h3>
            <p>Pending Verifications</p>
            <span className="negative">↓ 5% from last month</span>
          </div>
          <div className="stat-card" onClick={() => setPage("verify")} style={{ cursor: "pointer" }}>
            <div className="icon purple">🛡</div>
            <h3>102</h3>
            <p>Total Verifications</p>
            <span className="positive">↑ 18% from last month</span>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="activity">
          <div className="activity-header">
            <h3>Recent Activity</h3>
            <span className="view" onClick={() => setPage("certificates")}>
              View all activity
            </span>
          </div>
          <ul>
            <li>Certificate uploaded for John Doe <span>2 minutes ago</span></li>
            <li>Certificate verified for ID: VER-8F3A7C2D <span>10 minutes ago</span></li>
            <li>Certificate uploaded for Emily Johnson <span>1 hour ago</span></li>
            <li className="error">
              Certificate verification failed for ID: VER-9B7D2E1F
              <span>2 hours ago</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;