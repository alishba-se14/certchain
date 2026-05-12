import React, { useState } from "react";
import Home         from "./pages/Home";
import Verify       from "./pages/Verify";
import Dashboard    from "./pages/Dashboard";
import Login        from "./pages/Login";
import Upload       from "./pages/Upload";
import Certificates from "./pages/Certificates";
import Signup       from "./pages/Signup";
import NotFound     from "./pages/NotFound";
import Blockchain   from "./pages/Blockchain";

function App() {
  const [page, setPage] = useState("home");

  switch (page) {
    case "home":         return <Home         setPage={setPage} />;
    case "login":        return <Login        setPage={setPage} />;
    case "signup":       return <Signup       setPage={setPage} />;
    case "verify":       return <Verify       setPage={setPage} />;
    case "dashboard":    return <Dashboard    setPage={setPage} />;
    case "upload":       return <Upload       setPage={setPage} />;
    case "certificates": return <Certificates setPage={setPage} />;
    case "blockchain":   return <Blockchain   setPage={setPage} />;
    default:             return <NotFound     setPage={setPage} />;
  }
}

export default App;