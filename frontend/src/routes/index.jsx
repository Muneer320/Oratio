import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const JoinRoom = lazy(() => import("../pages/JoinRoom"));
const AddDebate = lazy(() => import("../pages/AddDebate"));
const Debate = lazy(() => import("../pages/Debate"));
const UpcomingDebateDetails = lazy(() => import("../pages/UpcomingDebateDetails"));
const Results = lazy(() => import("../pages/Results"));
const Trainer = lazy(() => import("../pages/Trainer"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const About = lazy(() => import("../pages/About"));
const NotFound = lazy(() => import("../pages/NotFound"));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-base" aria-label="Loading page" />}>
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
    </Suspense>
  );
}

export default AppRoutes;
