import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import DebateArena from "../pages/DebateArena";
import HostDashboard from "../pages/HostDashboard";
import SpectatorView from "../pages/SpectatorView";
import ResultPage from "../pages/ResultPage";
import TrainerPage from "../pages/TrainerPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/host" element={<HostDashboard />} />
      <Route path="/debate/:roomId" element={<DebateArena />} />
      <Route path="/spectate/:roomId" element={<SpectatorView />} />
      <Route path="/results/:roomId" element={<ResultPage />} />
      <Route path="/trainer" element={<TrainerPage />} />
    </Routes>
  );
}

export default AppRoutes;
