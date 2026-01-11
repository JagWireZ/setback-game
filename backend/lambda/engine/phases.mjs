export const PHASES = {
  LOBBY: "lobby",

  // Round initialization
  DEALING: "dealing",          // dealCards + revealTrump happen here
  BIDDING: "bidding",          // players submit bids

  // Trick-taking gameplay
  PLAYING: "playing",          // players play cards until round ends

  // Round wrap-up
  SCORING: "scoring",          // scoreRound + scoreGame

  // Transition to next round
  BETWEEN_ROUNDS: "betweenRounds",

  // Final state
  GAME_OVER: "gameOver"
};
