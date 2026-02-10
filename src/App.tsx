import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { LandingPage } from "./pages/LandingPage";
import { GameSelectionRoute } from "./pages/GameSelectionRoute";
import { AlphabetFinderRoute } from "./pages/Game/Alphabet_Finder/AlphabetFinderRoute";
import { LetterMatchRoute } from "./pages/Game/Letter_Match/LetterMatchRoute";
import { ObstacleDodgeRoute } from "./pages/Game/Obstacle_Dodge/ObstacleDodgeRoute";
import { PakadKeDikhaoRoute } from "./pages/Game/Pakad_ke_Dikhao/PakadKeDikhaoRoute";
import { BhulBhalaiyaRoute } from "./pages/Game/Bhul_Bhalaiya/BhulBhalaiyaRoute";

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game-selection" element={<GameSelectionRoute />} />
          <Route path="/game/alphabet-finder" element={<AlphabetFinderRoute />} />
          <Route path="/game/letter-match" element={<LetterMatchRoute />} />
          <Route path="/game/obstacle-dodge" element={<ObstacleDodgeRoute />} />
          <Route path="/game/pakad-ke-dikhao" element={<PakadKeDikhaoRoute />} />
          <Route path="/game/bhul-bhalaiya" element={<BhulBhalaiyaRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
