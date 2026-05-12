import React, { useState, useEffect } from "react";
import "../styles/pages/Blockchain.css";
import { getBlockchainLedger } from "../services/api";

function Blockchain({ setPage }) {
  const [open,    setOpen]    = useState(false);
  const [ledger,  setLedger]  = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        const { data } = await getBlockchainLedger();
        setLedger(data.ledger);
        setIsValid(data.isValid);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blockchain ledger");
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  const shortHash = (hash) => {
    if (!hash) return "";
    return hash.substring(0, 12) + "..." + hash.substring(hash.length - 8);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>

      {/* TOPBAR */}
      <div className="topbar">
        <span className="menu-icon" onClick={() => setOpen(true)}>☰</span>
        <h2 className="logo">CertChain</h2>
        <div className="nav-right">
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("verify")}>Verify</button>
          <button onClick={() => setPage("login")} className="login-btn">Login</button>
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
          <li className="active">Blockchain Ledger</li>
          <li onClick={() => { setPage("home");         setOpen(false); }}>Logout</li>
        </ul>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h2>Blockchain Ledger</h2>
            <p>View all blocks in the blockchain</p>
          </div>
          <div className={`chain-status ${isValid ? "valid" : "invalid"}`}>
            {isValid ? "✅ Chain Valid" : "❌ Chain Invalid"}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            Loading blockchain...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
            {error}
          </p>
        )}

        {/* BLOCKS */}
        {!loading && !error && (
          <div className="blockchain-container">
            {ledger.map((block, index) => (
              <div key={block.index}>

                {/* BLOCK CARD */}
                <div className={`block-card ${block.isGenesis ? "genesis" : ""}`}>

                  {/* BLOCK HEADER */}
                  <div className="block-header">
                    <span className="block-number">Block #{block.index}</span>
                    <span className={`block-type ${block.isGenesis ? "genesis-tag" : "cert-tag"}`}>
                      {block.isGenesis ? "Genesis" : "Certificate"}
                    </span>
                  </div>

                  {/* BLOCK BODY */}
                  <div className="block-body">

                    {/* DATA */}
                    <div className="block-section">
                      <h4>Data</h4>
                      {block.isGenesis ? (
                        <p className="block-value">Genesis Block — Start of Chain</p>
                      ) : (
                        <>
                          <div className="block-row">
                            <span className="block-label">Student</span>
                            <span className="block-value">{block.data.studentName}</span>
                          </div>
                          <div className="block-row">
                            <span className="block-label">Course</span>
                            <span className="block-value">{block.data.course}</span>
                          </div>
                          <div className="block-row">
                            <span className="block-label">Verify ID</span>
                            <span className="block-value verify-id">{block.data.verificationId}</span>
                          </div>
                          <div className="block-row">
                            <span className="block-label">Status</span>
                            <span className="block-value status-verified">{block.data.status}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* HASHES */}
                    <div className="block-section">
                      <h4>Hashes</h4>
                      <div className="block-row">
                        <span className="block-label">Hash</span>
                        <span className="block-value hash-value">{shortHash(block.hash)}</span>
                      </div>
                      <div className="block-row">
                        <span className="block-label">Prev Hash</span>
                        <span className="block-value hash-value">
                          {block.previousHash === "0" ? "0 (Genesis)" : shortHash(block.previousHash)}
                        </span>
                      </div>
                    </div>

                    {/* TIMESTAMP */}
                    <div className="block-section">
                      <h4>Timestamp</h4>
                      <p className="block-value">{formatDate(block.timestamp)}</p>
                    </div>

                  </div>
                </div>

                {/* CHAIN LINK */}
                {index < ledger.length - 1 && (
                  <div className="chain-link">
                    <div className="chain-arrow">↓</div>
                    <div className="chain-line"></div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Blockchain;