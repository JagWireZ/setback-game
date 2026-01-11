// engine/phases.mjs

export const PHASES = {
  LOBBY: "LOBBY",

  PRE_ROUND: "PRE_ROUND",         // choose dealer, set round number
  DEALING: "DEALING",             // shuffle, deal, reveal trump
  BIDDING: "BIDDING",             // players submit bids
  PLAYING: "PLAYING",             // trick-taking
  POST_ROUND: "POST_ROUND",       // scoring

  GAME_OVER: "GAME_OVER"
};
