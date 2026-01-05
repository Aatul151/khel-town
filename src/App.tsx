import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { LandingPage } from "./pages/LandingPage";
import { GameSelectionRoute } from "./pages/GameSelectionRoute";
import { AlphabetFinderRoute } from "./pages/Game/Alphabet_Finder/AlphabetFinderRoute";
import { LetterMatchRoute } from "./pages/Game/Letter_Match/LetterMatchRoute";

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game-selection" element={<GameSelectionRoute />} />
          <Route path="/game/alphabet-finder" element={<AlphabetFinderRoute />} />
          <Route path="/game/letter-match" element={<LetterMatchRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
