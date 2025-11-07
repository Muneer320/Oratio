import React from "react";

function ScoreBoard() {
  return (
    <div className="scoreboard">
      <div className="participant-score">
        <h3>Participant A</h3>
        <div className="lcr-scores">
          <span>Logic: 0</span>
          <span>Credibility: 0</span>
          <span>Rhetoric: 0</span>
        </div>
      </div>
      <div className="participant-score">
        <h3>Participant B</h3>
        <div className="lcr-scores">
          <span>Logic: 0</span>
          <span>Credibility: 0</span>
          <span>Rhetoric: 0</span>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
