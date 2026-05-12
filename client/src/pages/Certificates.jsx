import React, { useState, useEffect } from "react";
import "../styles/pages/Certificates.css";
import { getCertificates } from "../services/api";

function Certificates({ setPage }) {
  const [open,          setOpen]          = useState(false);
  const [search,        setSearch]        = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [certificates,  setCertificates]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const { data } = await getCertificates();
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load certificates");
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const filtered = certificates.filter(
    (c) =>
      c.studentName.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      c.verificationId.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayed  = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleFilter = () => {
    setAppliedSearch(search);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
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
          <li className="active">Certificates</li>
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
            <h2>Certificates</h2>
            <p>Manage and view all uploaded certificates</p>
          </div>
          <button className="cert-upload-btn" onClick={() => setPage("upload")}>
            + Upload Certificate
          </button>
        </div>

        <div className="cert-controls">
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="filter-btn" onClick={handleFilter}>⚙ Filter</button>
        </div>

        <div className="table-card">
          {loading && (
            <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
              Loading certificates...
            </p>
          )}
          {error && (
            <p style={{ textAlign: "center", padding: "20px", color: "#dc2626" }}>
              {error}
            </p>
          )}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Issue Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                      No certificates found
                    </td>
                  </tr>
                ) : (
                  displayed.map((c) => (
                    <tr key={c._id}>
                      <td>{c.verificationId}</td>
                      <td>{c.studentName}</td>
                      <td>{c.course}</td>
                      <td>{formatDate(c.issueDate)}</td>
                      <td>
                        <span className={`cert-badge ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="cert-actions">
                        <button title="View">👁</button>
                        <button title="More">⋯</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {!loading && !error && (
            <div className="table-footer">
              <span>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, filtered.length)} of{" "}
                {filtered.length} entries
              </span>
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Certificates;