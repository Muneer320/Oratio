import React from "react";
import { useParams } from "react-router-dom";

function ResultPage() {
  const { roomId } = useParams();

  return (
    <div className="result-page">
      <h1>Debate Results</h1>
      <div className="winner-announcement">{/* Winner display */}</div>
      <div className="score-breakdown">{/* LCR scores chart */}</div>
      <div className="feedback-section">{/* AI feedback */}</div>
    </div>
  );
}

export default ResultPage;
