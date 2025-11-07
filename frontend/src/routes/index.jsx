import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Host from "../pages/Host";
import Join from "../pages/Join";
import Debate from "../pages/Debate";
import Spectate from "../pages/Spectate";
import Trainer from "../pages/Trainer";
import Results from "../pages/Results";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/host" element={<ProtectedRoute><Host /></ProtectedRoute>} />
      <Route path="/join" element={<ProtectedRoute><Join /></ProtectedRoute>} />
      <Route path="/debate/:roomCode" element={<ProtectedRoute><Debate /></ProtectedRoute>} />
      <Route path="/spectate" element={<ProtectedRoute><Spectate /></ProtectedRoute>} />
      <Route path="/trainer" element={<ProtectedRoute><Trainer /></ProtectedRoute>} />
      <Route path="/results/:roomCode" element={<ProtectedRoute><Results /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;
