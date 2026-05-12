import React, { useState } from "react";
import "../styles/pages/Verify.css";
import { verifyCertificate } from "../services/api";

const Verify = ({ setPage }) => {
  const [open,           setOpen]           = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [result,         setResult]         = useState(null);
  const [error,          setError]          = useState("");
  const [loading,        setLoading]        = useState(false);

  const handleVerify = async () => {
    if (verificationId.trim() === "") return;
    setError("");
    setResult(null);

    try {
      setLoading(true);
      const { data } = await verifyCertificate(verificationId);
      setResult(data.certificate);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Certificate not found or invalid!");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div>

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
          <li className="active">Verify</li>
          <li onClick={() => { setPage("blockchain");   setOpen(false); }}>Blockchain Ledger</li>
          <li onClick={() => { setPage("home");         setOpen(false); }}>Logout</li>
        </ul>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* MAIN */}
      <div className="verify-main">

        <div className="verify-header">
          <div>
            <h2>Verify Certificate</h2>
            <p className="subtitle">
              Enter the verification ID to verify the certificate authenticity
            </p>
          </div>
        </div>

        <div className="verify-box">
          <label>Verification ID</label>
          <div className="input-row">
            <input
              type="text"
              placeholder="Enter verification ID (e.g. VER-8F3A7C2D)"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
            />
            <button onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: "#fee2e2", color: "#dc2626",
            padding: "15px", borderRadius: "12px",
            marginTop: "20px", fontSize: "14px"
          }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="result-header">
              <div className="check">✔</div>
              <div>
                <h3>Valid Certificate</h3>
                <p>This certificate is valid and has been verified on the blockchain.</p>
              </div>
            </div>
            <div className="result-details">
              <div><strong>Student Name</strong><span>{result.studentName}</span></div>
              <div><strong>Course</strong><span>{result.course}</span></div>
              <div><strong>Issue Date</strong><span>{formatDate(result.issueDate)}</span></div>
              <div><strong>Status</strong><span>{result.status}</span></div>
              <div><strong>Verification ID</strong><span>{result.verificationId}</span></div>
              <div><strong>Blockchain Hash</strong>
                <span className="link">
                  {result.blockchainHash?.substring(0, 10)}...
                  {result.blockchainHash?.substring(result.blockchainHash.length - 10)}
                </span>
              </div>
              <div><strong>Previous Hash</strong>
                <span className="link">
                  {result.previousHash === "0" ? "0 (Genesis)" :
                    result.previousHash?.substring(0, 10) + "..." +
                    result.previousHash?.substring(result.previousHash.length - 10)
                  }
                </span>
              </div>
              <div><strong>Block Index</strong><span>#{result.blockIndex}</span></div>
            </div>
            <div className="verified-time">
              Verified on {formatDate(result.updatedAt)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;