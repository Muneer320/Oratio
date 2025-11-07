export const DEBATE_ROLES = {
  HOST: "host",
  PARTICIPANT: "participant",
  SPECTATOR: "spectator",
};

export const LCR_WEIGHTS = {
  LOGIC: 0.4,
  CREDIBILITY: 0.35,
  RHETORIC: 0.25,
};

export const REWARD_EMOJIS = ["👏", "🔥", "❤️", "💡", "🎯"];

export const ROUTES = {
  HOME: "/",
  HOST: "/host",
  DEBATE: "/debate/:roomId",
  SPECTATE: "/spectate/:roomId",
  RESULTS: "/results/:roomId",
  TRAINER: "/trainer",
};
