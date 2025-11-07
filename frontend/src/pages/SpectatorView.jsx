import React from "react";
import { useParams } from "react-router-dom";
import RewardPanel from "../components/RewardPanel";

function SpectatorView() {
  const { roomId } = useParams();

  return (
    <div className="spectator-view">
      <h1>Spectator View</h1>
      <div className="debate-stream">{/* Live debate stream */}</div>
      <RewardPanel />
    </div>
  );
}

export default SpectatorView;
