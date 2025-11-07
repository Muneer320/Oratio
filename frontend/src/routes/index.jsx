import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Home from "../pages/Home";
import Host from "../pages/Host";
import Join from "../pages/Join";
import Debate from "../pages/Debate";
import Spectate from "../pages/Spectate";
import Trainer from "../pages/Trainer";
import Results from "../pages/Results";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/host" element={<PageTransition><Host /></PageTransition>} />
        <Route path="/join" element={<PageTransition><Join /></PageTransition>} />
        <Route path="/debate/:roomCode" element={<PageTransition><Debate /></PageTransition>} />
        <Route path="/spectate" element={<PageTransition><Spectate /></PageTransition>} />
        <Route path="/trainer" element={<PageTransition><Trainer /></PageTransition>} />
        <Route path="/results/:roomCode" element={<PageTransition><Results /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
