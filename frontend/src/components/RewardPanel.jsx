import React from "react";

function RewardPanel() {
  const emojis = ["👏", "🔥", "❤️", "💡", "🎯"];

  const handleReward = (emoji) => {
    // TODO: Send reward to backend via WebSocket
    console.log("Rewarding with:", emoji);
  };

  return (
    <div className="reward-panel">
      <h3>Reward Debaters</h3>
      <div className="emoji-buttons">
        {emojis.map((emoji, idx) => (
          <button
            key={idx}
            className="emoji-btn"
            onClick={() => handleReward(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RewardPanel;
