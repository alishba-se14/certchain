import React from "react";
import "../styles/pages/NotFound.css";

function NotFound({ setPage }) {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-subtitle">
          Oops! The page you are looking for does not exist.
        </p>
        <button className="notfound-btn" onClick={() => setPage("home")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;