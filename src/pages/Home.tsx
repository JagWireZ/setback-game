import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from 'flowbite-react';

import CreateGameModal from '../components/Modals/CreateGameModal';
import JoinGameModal from '../components/Modals/JoinGameModal';

export default function Landing() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (data) => {
    console.log("Game created with:", data);
    navigate("/lobby/");
  };

  const handleJoin = ({ name, gameId }) => {
    console.log("Joining game:", gameId, "as", name);
    navigate(`/game/${gameId}`)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-700 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Set Back
        </h1>

        <p className="text-lg mb-10 leading-relaxed">
          A modern, multiplayer version of the classic trick‑taking card game.
          Play with friends, challenge AI opponents, and track your progress
          through all 19 rounds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setCreateModalOpen(true)}
            color="none"
            className="bg-primary cursor-pointer px-6 py-3 font-semibold"
          >
            Create Game
          </Button>
          <CreateGameModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreate}
          />

          <Button
            onClick={() => setJoinModalOpen(true)}
            color="none"
            className="bg-secondary cursor-pointer px-6 py-3 font-semibold"
          >
            Join Game
          </Button>
          <JoinGameModal
            open={joinModalOpen}
            onClose={() => setJoinModalOpen(false)}
            onJoin={handleJoin}
          />
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm">
        © {new Date().getFullYear()} Set Back
      </footer>
    </div>
  )
}
