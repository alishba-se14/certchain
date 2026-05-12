import React, { useState } from "react";
import "../styles/pages/Upload.css";
import { uploadCertificate } from "../services/api";

const Upload = ({ setPage }) => {
  const [open,        setOpen]        = useState(false);
  const [studentName, setStudentName] = useState("");
  const [course,      setCourse]      = useState("");
  const [file,        setFile]        = useState(null);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentName || !course || !file) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("studentName", studentName);
      formData.append("course",      course);
      formData.append("file",        file);

      const { data } = await uploadCertificate(formData);
      setSuccess(`Certificate uploaded! Verification ID: ${data.certificate.verificationId}`);
      setLoading(false);
      setStudentName("");
      setCourse("");
      setFile(null);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Upload failed");
    }
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
          <li className="active">Upload Certificate</li>
          <li onClick={() => { setPage("certificates"); setOpen(false); }}>Certificates</li>
          <li onClick={() => { setPage("verify");       setOpen(false); }}>Verify</li>
          <li onClick={() => { setPage("blockchain");   setOpen(false); }}>Blockchain Ledger</li>
          <li onClick={() => { setPage("home");         setOpen(false); }}>Logout</li>
        </ul>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <div className="upload-container">
        <div className="upload-card">
          <h2>Upload Certificate</h2>
          <p>Fill in the details below to upload a new certificate</p>

          {error && (
            <div style={{
              background: "#fee2e2", color: "#dc2626",
              padding: "10px", borderRadius: "8px",
              marginBottom: "15px", fontSize: "13px"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#dcfce7", color: "#16a34a",
              padding: "10px", borderRadius: "8px",
              marginBottom: "15px", fontSize: "13px"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Student Name</label>
            <input
              type="text"
              placeholder="Enter student full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <label>Course</label>
            <input
              type="text"
              placeholder="Enter course name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <label>Upload File</label>
            <div className="file-upload-box">
              <input type="file" onChange={handleFileChange} />
              <p>Drag and drop your file here, or <span>click to browse</span></p>
              <small>PDF, PNG, JPG (Max. 10MB)</small>
            </div>
            <button type="submit" className="upload-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload Certificate"}
            </button>
          </form>

          <button
            className="upload-btn"
            style={{ marginTop: "10px", background: "#6b7280" }}
            onClick={() => setPage("dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

    </div>
  );
};

export default Upload;