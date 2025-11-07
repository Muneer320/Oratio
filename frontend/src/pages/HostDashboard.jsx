import React, { useState } from "react";

function HostDashboard() {
  const [topic, setTopic] = useState("");
  const [references, setReferences] = useState([]);

  const handleCreateRoom = () => {
    // TODO: API call to create room
    console.log("Creating room with topic:", topic);
  };

  return (
    <div className="host-dashboard">
      <h1>Host Dashboard</h1>
      <div className="form-section">
        <label htmlFor="topic">Debate Topic</label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter debate topic..."
        />

        <div className="reference-upload">
          <label>Upload Reference Materials</label>
          <input type="file" multiple accept=".pdf,.mp3,.wav,audio/*" />
        </div>

        <button onClick={handleCreateRoom} className="btn btn-primary">
          Create Room
        </button>
      </div>
    </div>
  );
}

export default HostDashboard;
