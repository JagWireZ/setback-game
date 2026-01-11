export type PlayerType = "human" | "ai"

export interface Player {
  id: string
  name: string
  type: PlayerType
}
