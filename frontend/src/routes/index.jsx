import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Host from "../pages/Host";
import Join from "../pages/Join";
import Debate from "../pages/Debate";
import Spectate from "../pages/Spectate";
import Trainer from "../pages/Trainer";
import Results from "../pages/Results";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={<Host />} />
      <Route path="/join" element={<Join />} />
      <Route path="/debate/:roomCode" element={<Debate />} />
      <Route path="/spectate" element={<Spectate />} />
      <Route path="/trainer" element={<Trainer />} />
      <Route path="/results/:roomCode" element={<Results />} />
    </Routes>
  );
}

export default AppRoutes;
