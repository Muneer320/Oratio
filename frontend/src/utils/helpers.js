export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const calculateLCRScore = (logic, credibility, rhetoric) => {
  return (logic * 0.4 + credibility * 0.35 + rhetoric * 0.25).toFixed(2);
};

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
