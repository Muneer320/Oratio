import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import { AnimatePresence } from "framer-motion";
import "./styles/global.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <div className="app" key="app">
            <CustomCursor />
            <AppRoutes />
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
