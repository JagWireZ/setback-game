export const initialState = {
  "gameId": "TEMP-ID",
  "version": 1,

  "createdAt": 0,
  "updatedAt": 0,

  "creatorId": "TEMP-PLAYER-ID",
  "started": false,

  "options": {
    "maxPlayers": 5,
    "maxRoundCards": 10,
    "allowAI": true,
    "scoringMode": "standard"
  },

  "players": [
    {
      "id": "TEMP-PLAYER-ID",
      "name": "Player 1",
      "type": "human",
      "seat": 0,
      "connected": true
    }
  ],

  "phase": {
    "round": 0,
    "dealerId": null,
    "step": "lobby",
    "turnPlayerId": null,
    "bids": {},
    "trick": null
  },

  "cards": {
    "deck": [],
    "hands": {},
    "discard": [],
    "trump": null,
    "trumpCard": null
  },

  "scoring": {
    "rounds": [],
    "totals": {},
    "potentialTotals": {}
  },

  "history": [
    {
      "version": 1,
      "action": "create-game",
      "playerId": "TEMP-PLAYER-ID",
      "timestamp": 0
    }
  ],

  "metadata": {
    "lastWriterId": "TEMP-PLAYER-ID",
    "lastAction": "create-game",
    "lastActionAt": 0
  }
}
