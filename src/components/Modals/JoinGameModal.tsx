import { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "flowbite-react";

export default function JoinGameModal({ open, onClose, onJoin }) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !gameId.trim()) return;

    onJoin({
      name,
      gameId
    });

    onClose();
  };

  return (
    <Modal show={open} onClose={onClose}>
      <ModalHeader>Join Game</ModalHeader>

      <ModalBody>
        <div className="space-y-6">

          {/* Player Name */}
          <div>
            <Label htmlFor="name">Your Name (required)</Label>
            <TextInput
              id="name"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Game ID */}
          <div>
            <Label htmlFor="gameId">Game ID (required)</Label>
            <TextInput
              id="gameId"
              required
              placeholder="Enter the game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
          </div>

        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>

        <Button
          color="blue"
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={!name.trim() || !gameId.trim()}
        >
          Join Game
        </Button>
      </ModalFooter>
    </Modal>
  );
}
