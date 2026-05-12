import React from "react";

const Navbar = ({ setPage, setOpen }) => {
  return (
    <div className="topbar">
      <span className="menu-icon" onClick={() => setOpen(true)}>☰</span>

      <h2 className="logo">CertChain</h2>

      <div className="nav-right">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("verify")}>Verify</button>
        <button className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default Navbar;