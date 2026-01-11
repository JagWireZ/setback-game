type Suit =
  | "clubs"  
  | "diamonds"
  | "hearts"
  | "spades"
  | "joker"

type Rank =
  | "A" | "K" | "Q" | "J"
  | "10" | "9" | "8" | "7" | "6"
  | "5" | "4" | "3" | "2"
  | "BJ"  // Big Joker
  | "LJ"  // Little Joker

export interface Card {
  suit: Suit
  rank: Rank
}
