import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Home"
import Lobby from "./pages/Lobby"
import JoinGame from "./pages/JoinGame"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lobby/:gameId" element={<Lobby />} />
        <Route path="/join" element={<JoinGame />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
