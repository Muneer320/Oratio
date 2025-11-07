import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Oratio</h1>
        <p className="tagline">
          AI-powered debate arena that listens, learns, and levels up how people
          argue.
        </p>
      </header>

      <div className="action-buttons">
        <Link to="/host" className="btn btn-primary">
          Host a Debate
        </Link>
        <Link to="/debate/join" className="btn btn-secondary">
          Join Debate
        </Link>
        <Link to="/trainer" className="btn btn-tertiary">
          Train with AI
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
