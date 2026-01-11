export const getRules = () => {
  const { deck, suits, ranks, jokers } = generateDeck();

  return {
    deck: {
      totalCards: deck.length,
      cards: deck,
      suits,
      ranks,
      jokers
    },

    trickRules: {
      mustFollowSuit: true,
      trickSize: 5,
      trumpBeatsAll: true,
      jokersAreTrump: true,
      leadingSuitDeterminesFollow: true
    },

    cardHierarchy: {
      rankOrder: {
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        "10": 9,
        "J": 10,
        "Q": 11,
        "K": 12,
        "A": 13
      },
      jokerOrder: {
        "L": 1,
        "B": 2
      }
    },

    scoring: {
      categories: ["books", "extra", "rainbow", "trip"],
      tripRounds: ["3d", "2d", "1", "2u", "3u"],
      pointsPerBook: 10,
      pointsPerExtra: 1,
      pointsRainbow: 25,
      tripMultiplier: 3
    },

    players: {
      minPlayers: 5,
      maxPlayers: 5
    }
  };
};
