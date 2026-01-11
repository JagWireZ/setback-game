import { Card } from "./Card";

export type GameAction =
  // Game lifecycle
  | "createGame"
  | "joinGame"
  | "leaveGame"
  | "startGame"
  | "endGame"
  | "restartGame"
  | "getGameState"

  // Player management
  | "setPlayerName"
  | "setPlayerSeat"
  | "reconnectPlayer"
  | "setPlayerConnected"
  | "setPlayerDisconnected"
  | "addAIPlayer"
  | "removeAIPlayer"

  // Round setup
  | "shuffleDeck"
  | "dealCards"
  | "setDealer"
  | "setTrump"
  | "setTrumpCard"
  | "startRound"
  | "endRound"

  // Bidding
  | "submitBid"
  | "passBid"
  | "finalizeBids"

  // Trick-taking
  | "playCard"
  | "startTrick"
  | "endTrick"
  | "setTrickWinner"

  // Scoring
  | "updateScore"
  | "finalizeRoundScore"
  | "finalizeGameScore"

  // Admin / debug
  | "simulateAIMove"

  // Network / session
  | "heartbeat"
  | "notifyTurn";

export type ActionPayloadMap = {
  // Game management
  createGame: {
    maxCards: number;
    playerName: string;
  }
  startGame: {
    gameId: string
  }
  endGame: {
    gameId: string
  }
  restartGame: {
    gameId: string
  }

  // Player management
  joinGame: {
    gameId: string,
    playerName: string
  }
  leaveGame: {
    gameId: string,
    playerId: string
  }
  setPlayerName: {
    gameId: string,
    playerId: string,
    playerName: string
  }
  setPlayerSeat: {
    gameId: string,
    playerId: string,
    seat: number
  }
  reconnectPlayer: {
    gameId: string,
    playerId: string
  }
  setPlayerConnected: {
    gameId: string,
    playerId: string
  }
  setPlayerDisconnected: {
    gameId: string,
    playerId: string
  }
  addAIPlayer: {
    gameId: string
  }
  removeAIPlayer: {
    gameId: string
  }

  // Round setup
  shuffleDeck: {
    gameId: string
  }
  dealCards: {
    gameId: string,
    roundId: string
  }
  setDealer: {
    gameId: string,
    playerId: string,
    roundId: string
  }
  setTrump: {
    gameId: string,
    roundId: string
  }
  setTrumpCard: {
    gameId: string,
    roundId: string
  }
  startRound: {
    gameId: string,
    roundId: string
  }
  endRound: {
    gameId: string,
    roundId: string
  }

  // Bidding
  submitBid: {
    gameId: string,
    playerId: string,
    roundId: string,
    bid: number
  }
  passBid: {
    gameId: string,
    playerId: string,
    roundId: string
  }
  finalizeBids: {
    gameId: string,
    roundId: string
  }

  // Trick-taking
  playCard: {
    gameId: string,
    playerId: string,
    roundId: string,
    card: Card
  }
  startTrick: {
    gameId: string,
    roundId: string,
    leadPlayerId: string,
    trickIndex: number
  }
  endTrick: {
    gameId: string,
    roundId: string,
    trickIndex: number
  }
  setTrickWinner: {
    gameId: string,
    roundId: string,
    trickIndex: number
  }

  // Scoring
  updateScore: {
    gameId: string,
    playerId: string
  }
  finalizeRoundScore: {
    gameId: string,
    roundId: string
  }
  finalizeGameScore: {
    gameId: string
  }

  // Admin / debug
  simulateAIMove: {
    gameId: string,
    playerId: string,
    roundId: string,
    trickIndex: number
  }

  // Network / session
  heartbeat: {
    gameId: string,
    playerId: string
  }
  getGameState: {
    gameId: string
  }
  updateGameState: {
    gameId: string,
    state: any
  }
  notifyTurn: {
    gameId: string,
    playerId: string,
    roundId: string,
    trickIndex: number
  }
}