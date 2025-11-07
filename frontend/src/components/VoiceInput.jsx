import React, { useState } from "react";

function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement speech recognition
  };

  return (
    <div className="voice-input">
      <button
        className={`record-btn ${isRecording ? "recording" : ""}`}
        onClick={toggleRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <textarea placeholder="Or type your argument here..." rows="4" />
      <button className="btn btn-primary">Submit Turn</button>
    </div>
  );
}

export default VoiceInput;
