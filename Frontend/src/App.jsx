import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login/login";
import Register from "./pages/SignUp/Register";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashbord" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
