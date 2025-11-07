import React from "react";
import { useParams } from "react-router-dom";
import ScoreBoard from "../components/ScoreBoard";
import TurnDisplay from "../components/TurnDisplay";
import VoiceInput from "../components/VoiceInput";

function DebateArena() {
  const { roomId } = useParams();

  return (
    <div className="debate-arena">
      <ScoreBoard />
      <div className="debate-main">
        <TurnDisplay />
        <VoiceInput />
      </div>
    </div>
  );
}

export default DebateArena;
