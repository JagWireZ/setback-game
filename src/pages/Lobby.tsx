import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams, useLocation } from "react-router-dom";

const { gameId } = useParams();
const { state } = useLocation();
const playerName = state?.playerName;

import { createGameId } from "../lib/idGenerator"

interface PlayerInfo {
  id: string
  name: string
  type: "human" | "ai"
}

export default function CreateGame() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [players, setPlayers] = useState<PlayerInfo[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Call Lambda to create a new game
  useEffect(() => {
    async function initGame() {
      try {

        setGameId(createGameId())

        // Replace with your real Lambda endpoint
        const res = await fetch(
          "https://your-lambda-endpoint.amazonaws.com/create-game",
          { method: "POST" }
        )

        const data = await res.json()

        setPlayers(data.players) // Lambda returns initial players
      } catch (err) {
        console.error("Failed to create game:", err)
      } finally {
        setLoading(false)
      }
    }

    initGame()
  }, [])

  function handleStartGame() {
    if (!gameId) return

    // Replace with your real Lambda endpoint
    fetch("https://your-lambda-endpoint.amazonaws.com/start-game", {
      method: "POST",
      body: JSON.stringify({ gameId }),
    })

    navigate(`/game/${gameId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Creating game…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-800 text-white px-6 py-10">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Waiting on players...</h1>

        {gameId && (
          <>
            <p className="text-lg mb-2">Your Game ID:</p>
            <button className="rounded-lg p-4 pl-10 pr-10 text-xl bg-slate-800">{gameId}</button>

            <p className="text-slate-300 m-4 mt-10">
              Share this link with your friends:
            </p>

            <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm mb-10 break-all flex items-center justify-center">
              <span className="">{`${window.location.origin}/join/${gameId}`}</span>
              <span className="ml-3 mt-1 text-4xl">⧉</span>
            </div>
          </>
        )}

        <h2 className="text-2xl font-semibold mb-4">Players</h2>

        <div className="space-y-3 mb-10">
          {players.map((p) => (
            <div
              key={p.id}
              className="flex justify-between bg-slate-800 px-4 py-3 rounded-lg"
            >
              <span>{p.name}</span>
              <span className="text-slate-400">{p.type === "ai" ? "AI" : "Human"}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
