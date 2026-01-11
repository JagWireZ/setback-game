import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Label, TextInput, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

export default function CreateGameModal({ open, onClose }) {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [maxCards, setMaxCards] = useState(10);

  const handleCreate = async (payload) => {
    try {
      // Call your Lambda endpoint
      const res = await fetch(
        "https://YOUR_API_GATEWAY_URL/create-game",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        console.error("Failed to create game");
        return;
      }

      const data = await res.json();
      const { gameId } = data;

      // Navigate to lobby
      navigate(`/lobby/${gameId}`, {
        state: { playerName: payload.name }
      });

      onClose();
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    handleCreate({
      name,
      options: {
        maxCards,
      },
    });
  };


  return (
    <Modal show={open} onClose={onClose}>
      <ModalHeader>Create New Game</ModalHeader>

      <ModalBody>
        <div className="space-y-6">

          {/* Name */}
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

          {/* Card Count */}
          <div>
            <Label htmlFor="maxCards">Card Count</Label>
            <TextInput
              id="maxCards"
              type="number"
              min={1}
              value={maxCards}
              onChange={(e) => setMaxCards(Number(e.target.value))}
            />
          </div>

        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>

        <Button color="blue" className="cursor-pointer" onClick={handleSubmit} disabled={!name.trim()}>
          Create Game
        </Button>
      </ModalFooter>
    </Modal>
  );
}
