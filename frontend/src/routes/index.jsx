import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import JoinRoom from "../pages/JoinRoom";
import AddDebate from "../pages/AddDebate";
import Debate from "../pages/Debate";
import UpcomingDebateDetails from "../pages/UpcomingDebateDetails";
import Results from "../pages/Results";
import Trainer from "../pages/Trainer";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/join" element={<ProtectedRoute><JoinRoom /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddDebate /></ProtectedRoute>} />
      <Route path="/debate/:roomCode" element={<ProtectedRoute><Debate /></ProtectedRoute>} />
      <Route path="/upcoming/:roomCode" element={<ProtectedRoute><UpcomingDebateDetails /></ProtectedRoute>} />
      <Route path="/results/:roomCode" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><Trainer /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
